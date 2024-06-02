const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
const { Op } = require('sequelize');

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { username, comment_text } = req.body;

    try {
        // Crear un nuevo comentario en el post especificado
        await Comment.create({ post_id: postId, username, comment_text });

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostComments = async (req, res) => {
    const { postId } = req.params;

    try {
        // Buscar todos los comentarios asociados con el ID de la publicación, ordenados por fecha descendente
        const comments = await Comment.findAll({
            where: { post_id: postId },
            order: [['comment_datetime', 'ASC']]
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteComment = async (req, res) => {
    const commentId = req.params.comment_id;
    const { username, post_username } = req.body;

    try {
        // Verifica que el comentario existe
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Verifica que el usuario sea el propietario del comentario o el propietario del post
        if (comment.username !== username && req.body.post_username !== post_username) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }

        // Elimina los likes asociados con el comentario
        await CommentLike.destroy({ where: { comment_id: commentId } });

        // Elimina el comentario
        await Comment.destroy({ where: { comment_id: commentId } });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
};

module.exports = {
    createComment,
    getPostComments,
    deleteComment
};
