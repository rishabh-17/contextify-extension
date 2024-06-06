import { useEffect, useState } from "react"

import add from "./assets/add.png"
import arrow from "./assets/arrow.png"
import cross from "./assets/cross.png"
import dashboard from "./assets/dashboard.png"
import diamond from "./assets/diamond.png"
import gear from "./assets/gear.png"
import save from "./assets/save.png"

import "./style.css"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function IndexSidePanel() {
  const [setting, setSetting] = useState(false)
  const [type, setType] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [searchedText, setSearchedText] = useState("")
  const [isImg, setIsImg] = useState(false)
  const [result, setResult] = useState("")

  chrome.runtime.onMessage.addListener(
    (message, messageSender, sendResponse) => {
      // console.log(message)
      if (message.img) {
        setIsImg(true)
        setSearchedText(message.url)
      } else {
        setSearchedText(message.msg)
      }
    }
  )

  async function contextify(url = "", data = {}) {
    try {
      const response = await fetch(url, {
        method: "POST",
        // mode: "cors",
        // cache: "no-cache",
        // credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          secret: await storage.get("key")
        },
        // redirect: "follow",
        // referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      })
      const result = await response.json()
      setResult(result.data)
    } catch (error) {
      console.error(error)
      setResult("error something went wrong, please try again later")
    }
  }

  useEffect(() => {
    // storage.get("key").then((key) => {
    //   console.log(key)
    // })
    if (searchedText) {
      contextify(
        "https://contextify-ai-dev.onrender.com/api/context/contextify",
        { text: searchedText, isImg: isImg }
      )
    }
  }, [searchedText])

  const handleSave = async () => {
    if (result) {
      try {
        const response = await fetch(
          "https://contextify-ai-dev.onrender.com/api/context/save",
          {
            method: "POST",
            // mode: "cors",
            // cache: "no-cache",
            // credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              secret: await storage.get("key")
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify({
              question: searchedText,
              answer: result,
              type: type
            })
          }
        )
        const res = await response.json()
        console.log(res)
        setOpenModal(false)
      } catch (error) {
        console.log(error)
        // setResult("error something went wrong, please try again later")
      }
    }
  }

  return searchedText ? (
    <>
      <div className="panel-container">
        {openModal && (
          <div className="modal">
            <div className="voiceSettings">
              <div className="button-box">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenModal(false)}>
                  <img src={cross} width={10} alt="" />
                </span>
              </div>
              <h3 style={{ marginBottom: 0 }}>Choose Type</h3>
              <p style={{ marginTop: 0 }}>
                select your prefered note type to save
              </p>

              <div className="typeContainer">
                <div
                  onClick={() => setType(1)}
                  className={`${type === 1 ? "active" : "inactive"}`}>
                  Things I know
                </div>
                <div
                  onClick={() => setType(2)}
                  className={`${type === 2 ? "active" : "inactive"}`}>
                  Notes
                </div>
                <div
                  onClick={() => setType(3)}
                  className={`${type === 3 ? "active" : "inactive"}`}>
                  Future Exploaration
                </div>
              </div>
            </div>
            <div className="button-box">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}
        <p className="logo-label">Contextify AI</p>
        <hr />
        {!setting ? (
          <>
            <div className="options">
              <p style={{ margin: "10px" }} onClick={() => setSetting(true)}>
                All Settings
              </p>
              <img
                src={gear}
                width={20}
                height={20}
                style={{ marginRight: 8 }}
                alt=""
                onClick={() => setSetting(true)}
              />
            </div>
            <hr />

            <div className="options">
              <p style={{ margin: "10px" }} onClick={() => setOpenModal(true)}>
                Save
              </p>
              <img
                src={save}
                height={20}
                alt=""
                style={{ marginRight: 8 }}
                onClick={() => setOpenModal(true)}
              />
            </div>
            <div className="main-body">
              {/* <div className="options">
          <img
            src={save}
            alt=""
            width={20}
            height={20}
            style={{ marginRight: 8, marginBottom: 4 }}
          />
        
        </div> */}
              <textarea
                className="textarea"
                placeholder="loading please wait...."
                value={result}
                onChange={(e) => setResult(e.target.value)}
                disabled={!!!result}></textarea>
            </div>
          </>
        ) : (
          <>
            <div className="options">
              <p
                style={{
                  margin: "10px",
                  display: "flex",
                  alignItems: "center"
                }}
                onClick={() => setSetting(false)}>
                <img
                  src={arrow}
                  width={20}
                  height={20}
                  style={{ marginRight: 8 }}
                  alt=""
                />
                Back
              </p>
            </div>
            <hr />

            <div className="main-body">
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
              <div className="switchSettings" style={{ padding: "0 10px" }}>
                <p className="switch-label2">Disable images</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    // checked={disableImage}
                    // onChange={(e) => setDisableImage(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />
            </div>
            <div className="unlock-container">
              <button className="unlock2">
                <div className="diamond">
                  <img src={diamond} width={20} alt="" />
                </div>
                Unlock Premium
              </button>
            </div>
          </>
        )}
        <footer className="footer">
          <div className="footer-button">
            <img src={add} width={20} height={20} alt="" /> New Context
          </div>
          <div className="footer-button">
            <img src={dashboard} width={20} height={20} alt="" />
            Dashboard
          </div>
        </footer>
        <p
          style={{ fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>
          Powered By: Contextify.ai
        </p>
      </div>
    </>
  ) : (
    <>loading...</>
  )
}

export default IndexSidePanel
