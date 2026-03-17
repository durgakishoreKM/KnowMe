import { useState } from "react"

function CreateProfile() {

  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [qrCode, setQrCode] = useState(null)

  const handleSubmit = async (e) => {

    e.preventDefault()

    const response = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        display_name: displayName,
        bio: bio
      })
    })

    const data = await response.json()

    setQrCode(data.qrCode)

  }

  return (

    <div>

      <h1>Create Your KnowMe Profile</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Profile</button>

      </form>

      {qrCode && (
        <div>
          <h3>Your QR Code</h3>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}

    </div>

  )
}

export default CreateProfile