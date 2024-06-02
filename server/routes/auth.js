// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const { User, Post, Friendship, Comment, PostLike, CommentLike } = require('../models');
// const { userController } = require('../controllers');
// const sequelize = require('../db');
// const { Op } = require('sequelize');
// const { QueryTypes } = require('sequelize');
// const pool = require('../db'); // Asegúrate de ajustar esta línea según tu configuración

// router.post('/register', async (req, res) => {
//     try {
//         const { username, email, password, birth_date, first_name, last_name, public_account } = req.body;
//         if (!username || !email || !password || !birth_date || !first_name || !last_name || public_account === undefined) {
//             return res.status(400).json({ message: 'Todos los campos son obligatorios' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ username, email, password: hashedPassword, birth_date, first_name, last_name, public_account });
//         res.status(201).json({ message: 'Usuario registrado correctamente', user });
//     } catch (error) {
//         console.error('Error al registrar usuario:', error);
//         res.status(500).json({ message: 'Error interno del servidor' });
//     }
// });

// router.post('/login', async (req, res) => {
//     const { identifier, password } = req.body;
//     try {
//         const user = await User.findOne({
//             where: { [Op.or]: [{ username: identifier }, { email: identifier }] }
//         });
//         if (!user) {
//             return res.status(400).json({ message: 'Usuario no encontrado' });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Contraseña incorrecta' });
//         }
//         const { password: _, ...userWithoutPassword } = user.get({ plain: true });
//         res.status(200).json({ user: userWithoutPassword });
//     } catch (error) {
//         console.error('Error al iniciar sesión:', error);
//         res.status(500).json({ message: 'Error interno del servidor' });
//     }
// });

// router.post('/publicar', async (req, res) => {
//     try {
//         const { message, author, date } = req.body;
//         const newPost = await Post.create({ username: author, message: message, post_datetime: date });
//         res.status(201).json(newPost);
//     } catch (error) {
//         console.error('Error al crear la publicación:', error);
//         res.status(500).json({ error: 'Error al crear la publicación' });
//     }
// });

// router.get('/user/:username/posts', async (req, res) => {
//     try {
//         const { username } = req.params;
//         const user = await User.findOne({ where: { username } });
//         if (!user) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//         const posts = await Post.findAll({ where: { username }, attributes: ['post_id', 'username', 'message', 'post_datetime'], order: [['post_datetime', 'DESC']] });
//         res.status(200).json({ posts });
//     } catch (error) {
//         console.error('Error al obtener las publicaciones del usuario:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// router.get('/explorar', async (req, res) => {
    // try {
    //     const publicPosts = await Post.findAll({
    //         include: {
    //             model: User,
    //             where: { public_account: true }
    //         }
    //     });
    //     res.status(200).json(publicPosts);
    // } catch (error) {
    //     console.error('Error al obtener publicaciones públicas:', error);
    //     res.status(500).json({ error: 'Error interno del servidor' });
    // }
// });

// // Ruta para enviar solicitud de amistad
// router.post('/friend-request', async (req, res) => {
//     const { requestingUser, receivingUser } = req.body;
//     try {
//         const [friendship, created] = await Friendship.findOrCreate({
//             where: {
//                 requesting_user: requestingUser,
//                 receiving_user: receivingUser
//             },
//             defaults: {
//                 friendship_status: 'pending'
//             }
//         });

//         if (!created) {
//             return res.status(409).json({ message: 'Solicitud de amistad ya enviada' });
//         }

//         res.status(201).json({ message: 'Solicitud de amistad enviada' });
//     } catch (error) {
//         console.error('Error al enviar la solicitud de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Ruta para obtener el estado de la solicitud de amistad
// router.get('/friend-request-status/:username', async (req, res) => {
//     const { username } = req.params;
//     const { requestingUser } = req.query;
//     try {
//         const friendship = await Friendship.findOne({
//             where: {
//                 [Op.or]: [
//                     { requesting_user: requestingUser, receiving_user: username },
//                     { requesting_user: username, receiving_user: requestingUser }
//                 ]
//             }
//         });

//         if (friendship) {
//             res.status(200).json({ status: friendship.friendship_status });
//         } else {
//             res.status(404).json({ status: null });
//         }
//     } catch (error) {
//         console.error('Error al verificar el estado de la solicitud de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Ruta para obtener datos del usuario y sus publicaciones
// router.get('/user/:username', async (req, res) => {
//     const { username } = req.params;
//     const { requestingUser } = req.query;

//     try {
//         const user = await User.findOne({
//             where: {
//                 username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
//             }
//         });

//         if (!user) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }

//         let isFriend = false;

//         const friendship = await Friendship.findOne({
//             where: {
//                 [Op.or]: [
//                     { requesting_user: requestingUser, receiving_user: username, friendship_status: 'accepted' },
//                     { requesting_user: username, receiving_user: requestingUser, friendship_status: 'accepted' }
//                 ]
//             }
//         });

//         isFriend = !!friendship;

//         const posts = await Post.findAll({
//             where: {
//                 username: { [Op.like]: username }  // Cambiar ILIKE a LIKE para compatibilidad con MariaDB
//             }
//         });

//         res.status(200).json({ user, posts, isFriend });
//     } catch (error) {
//         console.error('Error al obtener datos del usuario:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// router.get('/friend-request-status/:username', async (req, res) => {
//     const { username } = req.params;
//     const { requestingUser } = req.query;
//     try {
//         const [rows] = await pool.query(
//             'SELECT friendship_status FROM friendships WHERE requesting_user = ? AND receiving_user = ?',
//             [requestingUser, username]
//         );
//         if (rows.length > 0) {
//             res.status(200).json({ status: rows[0].friendship_status });
//         } else {
//             res.status(404).json({ status: null });
//         }
//     } catch (error) {
//         console.error('Error al verificar el estado de la solicitud de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });


// router.get('/posts/:username/friends', async (req, res) => {
//     const { username } = req.params;

//     try {
//         // Realizar la consulta en la base de datos para obtener las publicaciones de amigos
//         const friendPosts = await Post.findAll({
//             where: {
//                 username: {
//                     [Op.in]: sequelize.literal(`
//             (
//               SELECT receiving_user FROM friendships WHERE requesting_user = '${username}' AND friendship_status = 'accepted'
//               UNION
//               SELECT requesting_user FROM friendships WHERE receiving_user = '${username}' AND friendship_status = 'accepted'
//             )
//           `)
//                 }
//             }
//         });

//         // Devolver las publicaciones de amigos encontradas
//         res.status(200).json({ posts: friendPosts });
//     } catch (error) {
//         // Manejar errores internos del servidor
//         console.error('Error al obtener las publicaciones de amigos:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Obtener datos del usuario actual
// router.get('/editarPerfil/:username', async (req, res) => {
//     const currentUser = req.query.username;

//     try {
//         const user = await User.findByPk(currentUser);
//         if (!user) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error al obtener datos del usuario:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Actualizar datos del usuario
// router.put('/editarPerfil', async (req, res) => {
//     const { username, email, first_name, last_name, birth_date, public_account } = req.body;

//     try {
//         const user = await User.findByPk(username);
//         if (!user) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }

//         await user.update({ email, first_name, last_name, birth_date, public_account });

//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error al actualizar datos del usuario:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Ruta para obtener solicitudes de amistad recibidas
// router.get('/solicitudes/:username', async (req, res) => {
//     const { username } = req.params;

//     try {
//         const receivedRequests = await sequelize.query(`
//             SELECT friendships.*, requesting_user.username AS requesting_username
//             FROM friendships
//             INNER JOIN users AS requesting_user ON friendships.requesting_user = requesting_user.username
//             WHERE receiving_user = :username AND friendship_status = 'pending';
//         `, {
//             replacements: { username },
//             type: QueryTypes.SELECT,
//         });

//         res.status(200).json(receivedRequests);
//     } catch (error) {
//         console.error('Error al obtener solicitudes de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });
// // Ruta para aceptar una solicitud de amistad
// router.post('/solicitudes/aceptar', async (req, res) => {
//     const { requestId } = req.body;

//     try {
//         const friendRequest = await Friendship.findByPk(requestId);
//         if (!friendRequest) {
//             return res.status(404).json({ error: 'Solicitud de amistad no encontrada' });
//         }

//         friendRequest.friendship_status = 'accepted';
//         await friendRequest.save();

//         res.status(200).json({ message: 'Solicitud de amistad aceptada' });
//     } catch (error) {
//         console.error('Error al aceptar la solicitud de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Ruta para cancelar una solicitud de amistad
// router.post('/solicitudes/cancelar', async (req, res) => {
//     const { requestingUser, receivingUser } = req.body;

//     try {
//         const friendRequest = await Friendship.findOne({
//             where: {
//                 requesting_user: requestingUser,
//                 receiving_user: receivingUser,
//                 friendship_status: 'pending'
//             }
//         });

//         if (!friendRequest) {
//             return res.status(404).json({ error: 'Solicitud de amistad no encontrada' });
//         }

//         await friendRequest.destroy();
//         res.status(200).json({ message: 'Solicitud de amistad cancelada' });
//     } catch (error) {
//         console.error('Error al cancelar la solicitud de amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// // Ruta para eliminar una amistad existente
// router.post('/solicitudes/eliminar', async (req, res) => {
//     const { requestingUser, receivingUser } = req.body;

//     try {
//         const friendship = await Friendship.findOne({
//             where: {
//                 [Op.or]: [
//                     { requesting_user: requestingUser, receiving_user: receivingUser, friendship_status: 'accepted' },
//                     { requesting_user: receivingUser, receiving_user: requestingUser, friendship_status: 'accepted' }
//                 ]
//             }
//         });

//         if (!friendship) {
//             return res.status(404).json({ error: 'Amistad no encontrada' });
//         }

//         await friendship.destroy();
//         res.status(200).json({ message: 'Amistad eliminada' });
//     } catch (error) {
//         console.error('Error al eliminar la amistad:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

// router.post('/likes/:postId', async (req, res) => {
//     const { postId } = req.params;
//     const { username } = req.body;

//     try {
//         // Verificar si el usuario ya dio like al post
//         const existingLike = await PostLike.findOne({ where: { post_id: postId, username } });
//         if (existingLike) {
//             // Eliminar el like existente
//             await existingLike.destroy();
//             return res.status(200).json({ message: 'Like removed successfully' });
//         }

//         // Crear un nuevo like
//         await PostLike.create({ post_id: postId, username });

//         res.status(201).json({ message: 'Like added successfully' });
//     } catch (error) {
//         console.error('Error handling like:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// router.get('/likes/:postId', async (req, res) => {
//     const { postId } = req.params;

//     try {
//         const likes = await PostLike.findAll({ where: { post_id: postId } });
//         res.status(200).json(likes);
//     } catch (error) {
//         console.error('Error fetching likes:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Ruta para crear un nuevo comentario
// router.post('/comments/:postId', async (req, res) => {
//     const { postId } = req.params;
//     const { username, comment_text } = req.body;

//     try {
//         // Crear un nuevo comentario en el post especificado
//         await Comment.create({ post_id: postId, username, comment_text });

//         res.status(201).json({ message: 'Comment added successfully' });
//     } catch (error) {
//         console.error('Error adding comment:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Obtener comentarios por ID de la publicación
// router.get('/comments/:postId', async (req, res) => {
//     const { postId } = req.params;

//     try {
//         // Buscar todos los comentarios asociados con el ID de la publicación, ordenados por fecha descendente
//         const comments = await Comment.findAll({
//             where: { post_id: postId },
//             order: [['comment_datetime', 'DESC']]
//         });

//         res.status(200).json(comments);
//     } catch (error) {
//         console.error('Error fetching comments:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// router.get('/posts/:postId', async (req, res) => {
//     const { postId } = req.params;
//     try {
//         const post = await Post.findByPk(postId);
//         if (post) {
//             res.status(200).json(post);
//         } else {
//             res.status(404).json({ error: 'Post not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching post:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Ruta para obtener los likes de un comentario
// router.get('/comment-likes/:commentId', async (req, res) => {
    // const { commentId } = req.params;
    // try {
    //     const likes = await CommentLike.findAll({ where: { comment_id: commentId } });
    //     res.status(200).json(likes);
    // } catch (error) {
    //     console.error('Error fetching comment likes:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
// });

// // Ruta para dar/retirar like a un comentario
// router.post('/comment-likes/:commentId', async (req, res) => {
//     const { commentId } = req.params;
//     const { username } = req.body;
//     try {
//         const existingLike = await CommentLike.findOne({ where: { comment_id: commentId, username } });
//         if (existingLike) {
//             await existingLike.destroy();
//             res.status(200).json({ message: 'Like removed' });
//         } else {
//             await CommentLike.create({ comment_id: commentId, username });
//             res.status(201).json({ message: 'Like added' });
//         }
//     } catch (error) {
//         console.error('Error toggling comment like:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Ruta para eliminar un comentario
// router.delete('/comments/:comment_id', async (req, res) => {
//     const commentId = req.params.comment_id;
//     const { username } = req.body;

//     try {
//         // Verifica que el comentario existe
//         const comment = await Comment.findByPk(commentId);
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         // Verifica que el usuario sea el propietario del comentario o el propietario del post
//         if (comment.username !== username && req.body.post_username !== comment.post_username) {
//             return res.status(403).json({ error: 'Not authorized to delete this comment' });
//         }

//         // Elimina los likes asociados con el comentario
//         await CommentLike.destroy({ where: { comment_id: commentId } });

//         // Elimina el comentario
//         await Comment.destroy({ where: { comment_id: commentId } });

//         res.status(200).json({ message: 'Comment deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting comment:', error);
//         res.status(500).json({ error: 'Error deleting comment' });
//     }
// });

// // Ruta para eliminar un post y sus datos relacionados
//     const { post_id } = req.params;
// router.delete('/posts/:post_id', async (req, res) => {
//     const { username } = req.body;

//     try {
//         // Verifica si el usuario es el dueño del post
//         const post = await Post.findOne({ where: { post_id } });
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         if (post.username !== username) {
//             return res.status(403).json({ error: 'Unauthorized' });
//         }

//         // Obtiene los ids de los comentarios asociados al post
//         const comments = await Comment.findAll({
//             attributes: ['comment_id'],
//             where: { post_id }
//         });
//         const commentIds = comments.map(comment => comment.comment_id);

//         // Elimina los likes de los comentarios del post
//         await CommentLike.destroy({
//             where: { comment_id: { [Op.in]: commentIds } }
//         });

//         // Elimina los comentarios del post
//         await Comment.destroy({ where: { post_id } });

//         // Elimina los likes del post
//         await PostLike.destroy({ where: { post_id } });

//         // Elimina el post
//         await Post.destroy({ where: { post_id } });

//         res.json({ message: 'Post and related data deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting post:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



// module.exports = router;
// -----------------------------------------------------------------------------------------------------------------------------------
const express = require('express');
const { userController, postController, postLikeController, friendshipController, commentLikeController, commentController } = require('../controllers');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/publicar', postController.createPost);
router.get('/user/:username/posts', userController.getUserPosts);
router.get('/explorar', postController.getPublicPosts);
router.post('/friend-request', friendshipController.sendFriendRequest);
router.get('/friend-request-status/:username', friendshipController.getFriendRequestStatus);
router.get('/user/:username', userController.getUserByUsername);
router.get('/friends/:username', friendshipController.getFriends);
router.get('/posts/:username/friends', friendshipController.getFriendsPosts); // Ruta para obtener publicaciones de amigos
router.get('/editarPerfil/:username', userController.getProfileByUsername); // Ruta para obtener datos del usuario actual
router.put('/editarPerfil', userController.updateUserProfile);
router.get('/solicitudes/:username', friendshipController.getReceivedRequests); // Ruta para obtener solicitudes de amistad recibidas
router.post('/solicitudes/aceptar', friendshipController.acceptFriendRequest); // Ruta para aceptar una solicitud de amistad
router.post('/solicitudes/cancelar', friendshipController.cancelFriendRequest); // Ruta para cancelar una solicitud de amistad
router.post('/solicitudes/eliminar', friendshipController.deleteFriendship); // Ruta para eliminar una amistad existente
router.post('/likes/:postId', postLikeController.handlePostLike); // Ruta para manejar likes de publicaciones
router.get('/likes/:postId', postLikeController.getPostLikes); // Ruta para obtener los likes de una publicación
router.post('/comments/:postId', commentController.createComment); // Ruta para crear un nuevo comentario
router.get('/comments/:postId', commentController.getPostComments); // Ruta para obtener comentarios por ID de la publicación
router.get('/posts/:postId', postController.getPostById); // Ruta para obtener un post por ID
router.get('/comment-likes/:commentId', commentLikeController.getCommentLikes); // Ruta para obtener los likes de un comentario
router.post('/comment-likes/:commentId', commentLikeController.toggleCommentLike); // Ruta para dar/retirar like a un comentario
router.delete('/comments/:comment_id', commentController.deleteComment); // Ruta para eliminar un comentario
router.delete('/posts/:post_id', postController.deletePostAndRelatedData); // Ruta para eliminar un post y sus datos relacionados

module.exports = router;
// -----------------------------------------------------------------------------------------------------------------------------------