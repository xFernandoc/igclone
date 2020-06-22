import { useEffect, useState } from 'react'

export default function useBookSearch(pageNumber) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/allpost',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${localStorage.getItem("jwt")}`
        },
        body : JSON.stringify({size : pageNumber})
    })
    .then(res => res.json())
    .then(results=>{
        setData(results.posts)
        setHasMore(results.posts.length>0)
        setLoading(false)
    })
  }, [pageNumber])

  return { loading, data, hasMore }
}