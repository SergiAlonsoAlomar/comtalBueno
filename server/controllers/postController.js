const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const { Op } = require('sequelize');

const createPost = async (req, res) => {
    // try {
    //     const { message, author, date } = req.body;
    //     const newPost = await Post.create({ username: author, message: message, post_datetime: date });
    //     res.status(201).json(newPost);
    // } catch (error) {
    //     console.error('Error al crear la publicación:', error);
    //     res.status(500).json({ error: 'Error al crear la publicación' });
    // }

    try {
        const { message, author, date } = req.body;
        const newPost = await Post.create({ username: author, message: message, post_datetime: date });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({ error: 'Error al crear la publicación' });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const posts = await Post.findAll({
            where: { username },
            attributes: ['post_id', 'username', 'message', 'post_datetime'],
            order: [['post_datetime', 'DESC']]
        });
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getPublicPosts = async (req, res) => {
    try {
        const publicPosts = await Post.findAll({
            include: {
                model: User,
                where: { public_account: true }
            }
        });
        res.status(200).json(publicPosts);
    } catch (error) {
        console.error('Error al obtener publicaciones públicas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deletePost = async (req, res) => {
    const { post_id } = req.params;
    const { username } = req.body;

    try {
        const post = await Post.findOne({ where: { post_id } });
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        if (post.username !== username) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const comments = await Comment.findAll({
            attributes: ['comment_id'],
            where: { post_id }
        });
        const commentIds = comments.map(comment => comment.comment_id);

        await CommentLike.destroy({
            where: { comment_id: { [Op.in]: commentIds } }
        });

        await Comment.destroy({ where: { post_id } });
        await PostLike.destroy({ where: { post_id } });
        await Post.destroy({ where: { post_id } });

        res.json({ message: 'Post y datos relacionados eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const likePost = async (req, res) => {
    const { post_id, username } = req.params;

    try {
        // Verificar si el post existe
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Verificar si el usuario ya le dio like al post
        const existingLike = await PostLike.findOne({
            where: {
                post_id,
                username
            }
        });
        if (existingLike) {
            return res.status(400).json({ error: 'El usuario ya dio like a este post' });
        }

        // Crear el like en el post
        await PostLike.create({
            post_id,
            username
        });

        res.status(201).json({ message: 'Like agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar like al post:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const unlikePost = async (req, res) => {
    const { post_id, username } = req.params;

    try {
        // Verificar si el like existe
        const existingLike = await PostLike.findOne({
            where: {
                post_id,
                username
            }
        });
        if (!existingLike) {
            return res.status(404).json({ error: 'Like no encontrado' });
        }

        // Eliminar el like del post
        await existingLike.destroy();

        res.status(200).json({ message: 'Like eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar like del post:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deletePostAndRelatedData = async (req, res) => {
    // const { post_id, username } = req.params;

    // try {
    //     const post = await Post.findOne({ where: { post_id } });
    //     if (!post) {
    //         return res.status(404).json({ error: 'Publicación no encontrada' });
    //     }

    //     if (post.username !== username) {
    //         return res.status(403).json({ error: 'No autorizado para eliminar esta publicación' });
    //     }

    //     // Eliminar los likes de la publicación
    //     await PostLike.destroy({ where: { post_id } });

    //     // Obtener y eliminar los comentarios de la publicación
    //     const comments = await Comment.findAll({ where: { post_id } });
    //     const commentIds = comments.map(comment => comment.comment_id);

    //     // Eliminar los likes de los comentarios
    //     await CommentLike.destroy({ where: { comment_id: { [Op.in]: commentIds } } });

    //     // Eliminar los comentarios
    //     await Comment.destroy({ where: { post_id } });

    //     // Eliminar la publicación
    //     await Post.destroy({ where: { post_id } });

    //     res.json({ message: 'Publicación y datos relacionados eliminados correctamente' });
    // } catch (error) {
    //     console.error('Error al eliminar la publicación y datos relacionados:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }

    const { post_id } = req.params;
    const { username } = req.body;

    try {
        // Verifica si el usuario es el dueño del post
        const post = await Post.findOne({ where: { post_id } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.username !== username) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Obtiene los ids de los comentarios asociados al post
        const comments = await Comment.findAll({
            attributes: ['comment_id'],
            where: { post_id }
        });
        const commentIds = comments.map(comment => comment.comment_id);

        // Elimina los likes de los comentarios del post
        await CommentLike.destroy({
            where: { comment_id: { [Op.in]: commentIds } }
        });

        // Elimina los comentarios del post
        await Comment.destroy({ where: { post_id } });

        // Elimina los likes del post
        await PostLike.destroy({ where: { post_id } });

        // Elimina el post
        await Post.destroy({ where: { post_id } });

        res.json({ message: 'Post and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostById = async (req, res) => {
    // const { postId } = req.params;

    // try {
    //     const post = await Post.findByPk(postId);
    //     if (!post) {
    //         return res.status(404).json({ error: 'Publicación no encontrada' });
    //     }

    //     res.status(200).json(post);
    // } catch (error) {
    //     console.error('Error al obtener la publicación:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }

    const { postId } = req.params;
    try {
        const post = await Post.findByPk(postId);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPost,
    getUserPosts,
    getPublicPosts,
    deletePost,
    likePost,
    unlikePost,
    deletePostAndRelatedData,
    getPostById
};
