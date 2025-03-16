import React, { useEffect, useState } from 'react'
import { customFetch, refreshAccessToken } from './utils'
import axios from "axios"
import YTVideo from './YTVideo'

// export let ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN

const App = () => {
  const [myVideos, setMyVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      setLoading(true)
      axios.get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyBU4v3l-10VenpGh6x7kKl73mGb5Dk9jpw&channelId=UCg-81tzITWNcBZJkBBdiclQ")
      .then((res) => {
        setMyVideos(res?.data?.items.filter(item => Object.keys(item?.id).includes("videoId")))
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      console.log("getting token")
      refreshAccessToken().then((token) => ACCESS_TOKEN = token)
    }, 1000*60*60)

    return () => {
      clearTimeout(id)
    }
  }, [])

  if (myVideos.length == 0){
    return <h1>No Videos to show</h1>
  }

  if (loading){
    return <h1 className='w-fit mx-auto text-xl font-semibold'>Loading...</h1>
}

  return (
    <div className='max-w-3xl mx-auto p-2 flex flex-col items-center gap-4 bg-slate-300'>
      {
        myVideos.map((video,i) => {
          return (
            <YTVideo key={i} videoId={video?.id?.videoId}/>
          )
        })
      }
    </div>
  )
}

export default App