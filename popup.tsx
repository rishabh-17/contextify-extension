import { useEffect, useState } from "react"

import "./style.css"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function IndexPopup() {
  const [key, setKey] = useState()
  const [input, setInput] = useState("")
  const [type, setType] = useState(1)
  const [disableImage, setDisableImage] = useState(false)
  const [disableText, setDisableText] = useState(false)
  const isKey = async () => {
    const key = await storage.get("key")
    setKey(key)
  }

  const handleKey = async () => {
    if (input) {
      await storage.set("key", input)
      setKey(input)
      console.log(await storage.get("key"), key)
    }
  }

  useEffect(() => {
    isKey()
  }, [])

  return !key ? (
    <div className="mainContainer">
      <p>Contextify AI</p>
      <hr />
      <h3>Welcome!</h3>
      <p>Please Provide your Secret key.</p>
      <input
        type="text"
        style={{ width: "100%", padding: "2px" }}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        style={{
          marginTop: 16,
          width: "100%",
          height: "30px",
          fontSize: "16px",
          backgroundColor: "#4b0170",
          color: "white"
        }}
        onClick={handleKey}>
        Start
      </button>
      <p
        style={{
          margin: "10px 0"
        }}>
        Don't have a key?{" "}
        <span
          style={{
            color: "#4b0170",
            textDecoration: "underline blue"
          }}>
          get one here
        </span>
      </p>
    </div>
  ) : (
    <div className="mainContainer">
      <p>Contextify AI</p>
      <hr />
      <h2>Quick Settings</h2>
      <div className="voiceSettings">
        <h3 style={{ marginBottom: 0 }}>Choose Voice</h3>
        <p style={{ marginTop: 0 }}>setup your prefered tone</p>

        <div className="typeContainer">
          <div
            onClick={() => setType(1)}
            className={`${type === 1 ? "active" : "inactive"}`}>
            normal
          </div>
          <div
            onClick={() => setType(2)}
            className={`${type === 2 ? "active" : "inactive"}`}>
            sensetive
          </div>
          <div
            onClick={() => setType(3)}
            className={`${type === 3 ? "active" : "inactive"}`}>
            sensetive
          </div>
          <div
            onClick={() => setType(4)}
            className={`${type === 4 ? "active" : "inactive"}`}>
            sensetive
          </div>
          <div
            onClick={() => setType(5)}
            className={`${type === 5 ? "active" : "inactive"}`}>
            sensetive
          </div>
          <div
            onClick={() => setType(6)}
            className={`${type === 6 ? "active" : "inactive"}`}>
            sensetive
          </div>
        </div>
      </div>
      <div className="switchSettings">
        <p className="switch-label">Disable images</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={disableImage}
            onChange={(e) => setDisableImage(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="switchSettings">
        <p className="switch-label">Disable text</p>
        <label className="switch">
          <input
            type="checkbox"
            checked={disableText}
            onChange={(e) => setDisableText(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="switchSettings">
        <p className="switch-label">Extra </p>
        <label className="switch">
          <input
            type="checkbox"
            checked={disableImage}
            onChange={(e) => setDisableImage(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <hr />
      <div className="premium">
        <h4>Utilize full potential of Contextify</h4>
        <button className="unlock">Unlock Premium</button>
      </div>
      <hr />
      <div className="footer">
        <a href="">Dashboard</a>
      </div>
    </div>
  )
}

export default IndexPopup
