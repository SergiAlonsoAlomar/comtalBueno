const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const { Op } = require('sequelize');

const toggleLike = async (req, res) => {
    const { postId } = req.params;
    const { username } = req.body;

    try {
        const existingLike = await PostLike.findOne({ where: { post_id: postId, username } });
        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ message: 'Like removed successfully' });
        }

        await PostLike.create({ post_id: postId, username });
        res.status(201).json({ message: 'Like added successfully' });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostLikes = async (req, res) => {
    // const { postId } = req.params;

    // try {
    //     const likes = await PostLike.findAll({ where: { post_id: postId } });
    //     res.status(200).json(likes);
    // } catch (error) {
    //     console.error('Error fetching likes:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }

    const { postId } = req.params;

    try {
        const likes = await PostLike.findAll({ where: { post_id: postId } });
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handlePostLike = async (req, res) => {
    // const { postId } = req.params;
    // const { username } = req.body;

    // try {
    //     // Verificar si el post existe
    //     const post = await Post.findByPk(postId);
    //     if (!post) {
    //         return res.status(404).json({ error: 'Publicación no encontrada' });
    //     }

    //     // Verificar si el usuario ya le dio like al post
    //     const existingLike = await PostLike.findOne({
    //         where: {
    //             post_id: postId,
    //             username: username
    //         }
    //     });

    //     if (existingLike) {
    //         // Si el like existe, eliminarlo (unlike)
    //         await existingLike.destroy();
    //         return res.status(200).json({ message: 'Like eliminado correctamente' });
    //     } else {
    //         // Si el like no existe, crearlo (like)
    //         await PostLike.create({ post_id: postId, username: username });
    //         return res.status(201).json({ message: 'Like agregado correctamente' });
    //     }
    // } catch (error) {
    //     console.error('Error al manejar el like del post:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }

    const { postId } = req.params;
    const { username } = req.body;

    try {
        // Verificar si el usuario ya dio like al post
        const existingLike = await PostLike.findOne({ where: { post_id: postId, username } });
        if (existingLike) {
            // Eliminar el like existente
            await existingLike.destroy();
            return res.status(200).json({ message: 'Like removed successfully' });
        }

        // Crear un nuevo like
        await PostLike.create({ post_id: postId, username });

        res.status(201).json({ message: 'Like added successfully' });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    toggleLike,
    getPostLikes,
    handlePostLike
};
