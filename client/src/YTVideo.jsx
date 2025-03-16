import React, { useState } from 'react'
import axios from "axios"
import { ACCESS_TOKEN } from './App'
import { toast } from 'react-toastify'
import { saveToDataBase } from './utils'

const YTVideo = ({videoId}) => {
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [submitting, setSubmitting] = useState(false)
    
    const getComments = async () => {
        setSubmitting(true)
        try {
            const resp = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10`, {
                headers: {
                    Authorization : `Bearer ${ACCESS_TOKEN}`
                }
            })
            setComments([...resp?.data?.items])
        } catch (error) {
            console.log(error)
        }
        setSubmitting(false)
    }

    const postComment = async () => {
        if (!comment) return

        setSubmitting(true)

        const data = {
            snippet: {
              topLevelComment: {
                snippet: {
                  videoId: videoId,
                  textOriginal: comment,
                }
              }
            }
          }

        try {
            await axios.post("https://www.googleapis.com/youtube/v3/commentThreads?part=snippet", data, {
                headers : {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            })

            setComment("")
            toast.success("comment added")
            saveToDataBase("Comment_Added")
        } catch (error) {
            console.log(error)
        }

        setSubmitting(false)
    }


    const addTitle = async () => {
        if (!title) return

        setSubmitting(true)

        const data = {
            id: videoId,
            snippet: {
              title,
              categoryId: "22"
            }
          }

        try {
            await axios.put("https://www.googleapis.com/youtube/v3/videos?part=snippet", data, {
                headers : {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            })

            setTitle("")
            toast.success("title added")
            saveToDataBase("Title_Change")
        } catch (error) {
            console.log(error)
        }

        setSubmitting(false)
    }

    const deleteComment = async (commentId) => {
        setSubmitting(true)

        try {
            await axios.delete(`https://www.googleapis.com/youtube/v3/comments?id=${commentId}`, {
                headers : {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                }
            })
            
            toast.success("comment deleted")
            saveToDataBase("Comment_Deleted")
        } catch (error) {
            console.log(error)
        }

        setSubmitting(false)
    }
    

  return (
    <div>
        <div className="w-full max-w-lg mx-auto p-2">
      <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div>
        {/* add titles and comments */}
        <div className='mt-2'>
      <div>
        <label htmlFor="title">Video Title : </label>
        <input className='border-2 rounded-md p-1' type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <button className='py-1 px-4 rounded-md bg-gray-400' disabled={submitting} onClick={addTitle}>Add</button>
      </div>
      <div>
      <div>
        <label htmlFor="comment">Comment : </label>
        <input className='border-2 rounded-md p-1' type='text' id='comment' value={comment} onChange={(e) => setComment(e.target.value)}/>
      </div>
      <button className='py-1 px-4 rounded-md bg-gray-400' disabled={submitting} onClick={postComment}>Add</button>
      </div>
      <div>
        <button className='mt-2' disabled={submitting} onClick={getComments}>Get Comments</button>
        {/* show cooments */}
        <div>
            {
                comments?.map(comment => {
                    return (
                        <div key={comment?.id} className='border-2 flex justify-between items-center p-1'>
                            <h1>{comment?.snippet?.topLevelComment?.snippet?.textDisplay}</h1>
                            <button disabled={submitting} onClick={() => deleteComment(comment?.id)}>Delete</button>
                        </div>
                    )
                })
            }
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default YTVideo