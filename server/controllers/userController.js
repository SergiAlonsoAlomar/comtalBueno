const bcrypt = require('bcrypt');
const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const { Op } = require('sequelize');

const register = async (req, res) => {
        try {
        const { username, email, password, birth_date, first_name, last_name, public_account } = req.body;

        // Verificar que todos los campos estén presentes
        if (!username || !email || !password || !birth_date || !first_name || !last_name || public_account === undefined) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            birth_date,
            first_name,
            last_name,
            public_account
        });

        // Responder con éxito
        res.status(201).json({ message: 'Usuario registrado correctamente', user });

    } catch (error) {
        // Manejar el error de nombre de usuario o correo electrónico ya en uso
        if (error.name === 'SequelizeUniqueConstraintError') {
            let errorMessage = '';
            if (error.errors) {
                error.errors.forEach((err) => {
                    if (err.path === 'PRIMARY') {
                        errorMessage = 'El nombre de usuario ya está en uso';
                    } else if (err.path === 'email') {
                        errorMessage = 'El correo electrónico ya está en uso';
                    }
                });
            }
            if (!errorMessage) {
                errorMessage = 'El nombre de usuario y el correo electrónico ya están en uso';
            }
            return res.status(400).json({ message: errorMessage });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    // const { identifier, password } = req.body;
    // try {
    //     const user = await User.findOne({
    //         where: { [Op.or]: [{ username: identifier }, { email: identifier }] }
    //     });
    //     if (!user) {
    //         return res.status(400).json({ message: 'Usuario no encontrado' });
    //     }
    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         return res.status(400).json({ message: 'Contraseña incorrecta' });
    //     }
    //     const { password: _, ...userWithoutPassword } = user.get({ plain: true });
    //     res.status(200).json({ user: userWithoutPassword });
    // } catch (error) {
    //     console.error('Error al iniciar sesión:', error);
    //     res.status(500).json({ message: 'Error interno del servidor' });
    // }

    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({
            where: { [Op.or]: [{ username: identifier }, { email: identifier }] }
        });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const { password: _, ...userWithoutPassword } = user.get({ plain: true });
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const { requestingUser } = req.query;

    try {
        const user = await User.findOne({
            where: {
                username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let isFriend = false;

        if (requestingUser) {
            const friendship = await Friendship.findOne({
                where: {
                    [Op.or]: [
                        { requesting_user: requestingUser, receiving_user: username, friendship_status: 'accepted' },
                        { requesting_user: username, receiving_user: requestingUser, friendship_status: 'accepted' }
                    ]
                }
            });

            isFriend = !!friendship;
        }

        const posts = await Post.findAll({
            where: {
                username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
            }
        });

        res.status(200).json({ user, posts, isFriend });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

    // const { username } = req.params;
    // const { requestingUser } = req.query;

    // if (!requestingUser) {
    //     return res.status(401).json({ error: 'Usuario no autenticado' });
    // }

    // try {
    //     const user = await User.findOne({
    //         where: {
    //             username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
    //         }
    //     });

    //     if (!user) {
    //         return res.status(404).json({ error: 'Usuario no encontrado' });
    //     }

    //     let isFriend = false;

    //     const friendship = await Friendship.findOne({
    //         where: {
    //             [Op.or]: [
    //                 { requesting_user: requestingUser, receiving_user: username, friendship_status: 'accepted' },
    //                 { requesting_user: username, receiving_user: requestingUser, friendship_status: 'accepted' }
    //             ]
    //         }
    //     });

    //     isFriend = !!friendship;

    //     const posts = await Post.findAll({
    //         where: {
    //             username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
    //         }
    //     });

    //     res.status(200).json({ user, posts, isFriend });
    // } catch (error) {
    //     console.error('Error al obtener datos del usuario:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }
};

const updateUserProfile = async (req, res) => {
    // const { username, email, first_name, last_name, birth_date, public_account } = req.body;
    // try {
    //     const user = await User.findByPk(username);
    //     if (!user) {
    //         return res.status(404).json({ error: 'Usuario no encontrado' });
    //     }
    //     await user.update({ email, first_name, last_name, birth_date, public_account });
    //     res.status(200).json(user);
    // } catch (error) {
    //     console.error('Error al actualizar datos del usuario:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }

    const { username, email, first_name, last_name, birth_date, public_account } = req.body;

    try {
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await user.update({ email, first_name, last_name, birth_date, public_account });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al actualizar datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getUserPosts = async (req, res) => {
    // try {
    //     const { username } = req.params;
    //     const user = await User.findOne({ where: { username } });
    //     if (!user) {
    //         return res.status(404).json({ error: 'Usuario no encontrado' });
    //     }
    //     const posts = await Post.findAll({ where: { username }, attributes: ['post_id', 'username', 'message', 'post_datetime'], order: [['post_datetime', 'DESC']] });
    //     res.status(200).json({ posts });
    // } catch (error) {
    //     console.error('Error al obtener las publicaciones del usuario:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }

    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const posts = await Post.findAll({ where: { username }, attributes: ['post_id', 'username', 'message', 'post_datetime'], order: [['post_datetime', 'DESC']] });
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getProfileByUsername = async (req, res) => {
    // try {
    //     const { username } = req.params;
    //     const user = await User.findOne({
    //         where: { username },
    //         attributes: ['username', 'email', 'first_name', 'last_name', 'birth_date', 'public_account']
    //     });
    //     if (!user) {
    //         return res.status(404).json({ error: 'Usuario no encontrado' });
    //     }
    //     res.status(200).json(user);
    // } catch (error) {
    //     console.error('Error al obtener perfil de usuario:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }



    const currentUser = req.query.username;

    try {
        const user = await User.findByPk(currentUser);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    register,
    login,
    getUserByUsername,
    updateUserProfile,
    getUserPosts,
    getProfileByUsername
};

