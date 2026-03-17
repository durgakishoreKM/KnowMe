import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

function ProfilePage() {

  const { username } = useParams()

  const [profile, setProfile] = useState(null)

  useEffect(() => {

    const fetchProfile = async () => {

      const response = await fetch(`http://localhost:5000/api/profile/${username}`)
      const data = await response.json()

      setProfile(data)

    }

    fetchProfile()

  }, [username])

  if (!profile) {
    return <h2>Loading profile...</h2>
  }

  return (
    <div>
      <h1>{profile.display_name}</h1>
      <h3>@{profile.username}</h3>
      <p>{profile.bio}</p>
    </div>
  )

}

export default ProfilePage