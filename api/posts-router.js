const express = require('express')
const Posts = require('../data/db.js')

const router = express.Router()

// POST *
router.post('/', (req, res) => {
   const { title, contents } = req.body

   !(title && contents) ?
   res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
   })

   :

   Posts.insert(req.body)
      .then(post => {
         res.status(201).json(post)
      })
      .catch(err => {
         console.log('error with POST:', err)
         res.status(500).json({
            error: 'There was an error while saving the post to the database'
         })
      })
})

// POST *
router.post('/:id/comments', (req, res) => {
   const { post_id, text } = req.body

   !text ? res.status(400).json({
      errorMessage: 'Please provide text for the comment.'
   })

   :

   Posts.insertComment(req.body)
      .then(comment => {
         post_id ? res.status(201).json(comment) :

         res.status(404).json({
            message: 'The post with the specified ID does not exist.'
         })
      })
      .catch(err => {
         console.log('error with POST:', err)
         res.status(500).json({
            error: 'There was an error while saving the comment to the database'
         })
      })
})

// GET *
router.get('/', (req, res) => {
   Posts.find(req.query)
      .then(posts => {
         res.status(200).json(posts)
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The posts information could not be retrieved.'
          });
      })
})

// GET *
router.get('/:id', (req, res) => {
   const { id } = req.params

   Posts.findById(id)
      .then(post => {
         post 
            ?  res.status(200).json(post) 
            :  res.status(404).json({ 
                  message: 'The post with the specified ID does not exist.' 
               })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The post information could not be retrieved.'
          });
      })
})

// GET *
router.get('/:id/comments', (req, res) => {
   const { id } = req.params
   
   Posts.findPostComments(id)
      .then(post => {
         post 
            ?  res.status(200).json(post) 
            :  res.status(404).json({ 
                  message: 'The post with the specified ID does not exist.' 
               })         
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The comments information could not be retrieved.'
          });
      })
})

// DELETE *
router.delete('/:id', (req, res) => {
   const { id } = req.params
   
   Posts.findById(id)
      .then(post => {
         post 
            ?  Posts.remove(id)
                  .then(deleted => {
                     if (deleted) {
                        res.status(200).json(post)
                     } 
                  })
                  .catch(err => {
                     console.log(err)
                     res.status(500).json({
                        error: 'The post could not be removed'
                     });
                  })
         
            :  res.status(404).json({
                  message: 'The post with the specified ID does not exist.'
               })
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({
            error: 'The post information could not be retrieved.'
         });
      })
})

// PUT *
router.put('/:id', (req, res) => {
   const changes = req.body
   const { title, contents } = req.body
   const { id } = req.params

   !(title && contents) ?
   res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
   })

   :

   Posts.update(id, changes)
      .then(post => {
         post ?
         res.status(200).json(post)
         :
         res.status(404).json({ message: 'The post with the specified ID does not exist.' })
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: 'The post information could not be modified.'
         });
      });
})

module.exports = router