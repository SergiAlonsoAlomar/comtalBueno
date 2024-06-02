const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const sequelize = require('../db');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

const sendFriendRequest = async (req, res) => {
    const { requestingUser, receivingUser } = req.body;
    try {
        const [friendship, created] = await Friendship.findOrCreate({
            where: {
                requesting_user: requestingUser,
                receiving_user: receivingUser
            },
            defaults: {
                friendship_status: 'pending'
            }
        });

        if (!created) {
            return res.status(409).json({ message: 'Solicitud de amistad ya enviada' });
        }

        res.status(201).json({ message: 'Solicitud de amistad enviada' });
    } catch (error) {
        console.error('Error al enviar la solicitud de amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getFriendRequestStatus = async (req, res) => {
    const { username } = req.params;
    const { requestingUser } = req.query;
    try {
        const friendship = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { requesting_user: requestingUser, receiving_user: username },
                    { requesting_user: username, receiving_user: requestingUser }
                ]
            }
        });

        if (friendship) {
            res.status(200).json({ status: friendship.friendship_status });
        }
        // else {
        //     res.status(404).json({ status: null });
        // }
    } catch (error) {
        console.error('Error al verificar el estado de la solicitud de amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await Friendship.findByPk(requestId);
        if (!friendRequest) {
            return res.status(404).json({ error: 'Solicitud de amistad no encontrada' });
        }

        friendRequest.friendship_status = 'accepted';
        await friendRequest.save();

        res.status(200).json({ message: 'Solicitud de amistad aceptada' });
    } catch (error) {
        console.error('Error al aceptar la solicitud de amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const cancelFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await Friendship.findByPk(requestId);
        if (!friendRequest) {
            return res.status(404).json({ error: 'Solicitud de amistad no encontrada' });
        }

        await friendRequest.destroy();

        res.status(200).json({ message: 'Solicitud de amistad cancelada' });
    } catch (error) {
        console.error('Error al cancelar la solicitud de amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteFriendship = async (req, res) => {
    const { requestingUser, receivingUser } = req.body;

    try {
        const friendship = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { requesting_user: requestingUser, receiving_user: receivingUser, friendship_status: 'accepted' },
                    { requesting_user: receivingUser, receiving_user: requestingUser, friendship_status: 'accepted' }
                ]
            }
        });

        if (!friendship) {
            return res.status(404).json({ error: 'Amistad no encontrada' });
        }

        await friendship.destroy();
        res.status(200).json({ message: 'Amistad eliminada' });
    } catch (error) {
        console.error('Error al eliminar la amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const getFriendsPosts = async (req, res) => {
    const { username } = req.params;

    try {
        // Realizar la consulta en la base de datos para obtener las publicaciones de amigos
        const friendPosts = await Post.findAll({
            where: {
                username: {
                    [Op.in]: sequelize.literal(`
                (
                  SELECT receiving_user FROM friendships WHERE requesting_user = '${username}' AND friendship_status = 'accepted'
                  UNION
                  SELECT requesting_user FROM friendships WHERE receiving_user = '${username}' AND friendship_status = 'accepted'
                )
              `)
                }
            }
        });

        // Devolver las publicaciones de amigos encontradas
        res.status(200).json({ posts: friendPosts });
    } catch (error) {
        // Manejar errores internos del servidor
        console.error('Error al obtener las publicaciones de amigos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

};

const getReceivedRequests = async (req, res) => {
    const { username } = req.params;

    try {
        const receivedRequests = await sequelize.query(`
                SELECT friendships.*, requesting_user.username AS requesting_username
                FROM friendships
                INNER JOIN users AS requesting_user ON friendships.requesting_user = requesting_user.username
                WHERE receiving_user = :username AND friendship_status = 'pending';
            `, {
            replacements: { username },
            type: QueryTypes.SELECT,
        });

        res.status(200).json(receivedRequests);
    } catch (error) {
        console.error('Error al obtener solicitudes de amistad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getFriends = async (req, res) => {
    const { username } = req.params;

    try {
        const friends = await User.findAll({
            where: {
                username: {
                    [Op.in]: sequelize.literal(`
                        (
                            SELECT receiving_user FROM friendships WHERE requesting_user = '${username}' AND friendship_status = 'accepted'
                            UNION
                            SELECT requesting_user FROM friendships WHERE receiving_user = '${username}' AND friendship_status = 'accepted'
                        )
                    `)
                }
            },
            attributes: ['username']
        });

        res.status(200).json({ friends });
    } catch (error) {
        console.error('Error al obtener amigos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    sendFriendRequest,
    getFriendRequestStatus,
    acceptFriendRequest,
    cancelFriendRequest,
    deleteFriendship,
    getFriendsPosts,
    getReceivedRequests,
    getFriends
};
