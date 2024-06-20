import { useEffect, useState } from "react"

import "./style.css"

import { Storage } from "@plasmohq/storage"

import logo from "./assets/icon.png"

const storage = new Storage()

function IndexPopup() {
  const [key, setKey] = useState()
  const [input, setInput] = useState("")
  const [type, setType] = useState(0)
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} height={40} width={40} alt="" />
        <p>Contextify</p>
      </div>
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
        <a
          href="https://www.contextify.info"
          target="_blank"
          style={{
            color: "#4b0170",
            textDecoration: "underline blue"
          }}>
          get one here
        </a>
      </p>
    </div>
  ) : (
    <div className="mainContainer">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} height={40} width={40} alt="" />
        <p>Contextify</p>
      </div>
      <hr />
      <h2>Quick Settings</h2>
      <div className="voiceSettings">
        <h3 style={{ marginBottom: 0 }}>Choose Voice</h3>
        <p style={{ marginTop: 0 }}>setup your Preferred tone</p>

        <div className="typeContainer">
          <div
            onClick={() => setType(1)}
            className={`${type === 1 ? "active" : "inactive"}`}>
            Professional
          </div>
          <div
            onClick={() => setType(2)}
            className={`${type === 2 ? "active" : "inactive"}`}>
            Cheeky
          </div>
          <div
            onClick={() => setType(3)}
            className={`${type === 3 ? "active" : "inactive"}`}>
            Conversational
          </div>
          <div
            onClick={() => setType(4)}
            className={`${type === 4 ? "active" : "inactive"}`}>
            Exicted
          </div>
          <div
            onClick={() => setType(5)}
            className={`${type === 5 ? "active" : "inactive"}`}>
            Kid-friendly
          </div>
        </div>
      </div>
      <hr />
      <div className="premium">
        <h4>Utilize full potential of Contextify</h4>
        <button className="unlock">Unlock Premium</button>
      </div>
      <hr />
      <div
        className="premium"
        style={{
          backgroundColor: "#4b0170",
          display: "flex",
          justifyContent: "center"
        }}>
        <a
          href="https://www.contextify.info/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
            backgroundColor: "#4b0170",
            fontWeight: "bold"
          }}
          target="_blank">
          Dashboard
        </a>
      </div>
      <p>
        To use the Contextify, highlight the text or right-click directly on an
        image and select "Contextify It” from the menu.
      </p>
    </div>
  )
}

export default IndexPopup
