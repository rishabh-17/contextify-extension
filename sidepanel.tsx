import { useEffect, useState } from "react"

import add from "./assets/add.png"
import arrow from "./assets/arrow.png"
import cancel from "./assets/cancel.png"
import cross from "./assets/cross.png"
import dashboard from "./assets/dashboard.png"
import diamond from "./assets/diamond.png"
import dislike from "./assets/dislike.png"
import dislikef from "./assets/dislikef.png"
import gear from "./assets/gear.png"
import logo from "./assets/icon.png"
import like from "./assets/like.png"
import likef from "./assets/likef.png"
import pause from "./assets/pause.png"
import play from "./assets/play.png"
import save from "./assets/save.png"
import speak from "./assets/speak.png"

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
  const [voice, setVoice] = useState(1)
  const [voices, setVoices] = useState([])
  const [speechSynthesisInstance, setSpeechSynthesisInstance] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [alltypes, setAlltypes] = useState([])
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState({
    rating: "",
    comment: "",
    idea: ""
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.img) {
      setIsImg(true)
      setSearchedText(message.url)
    } else {
      setIsImg(false)
      setSearchedText(message.msg)
    }
  })

  const handleTypes = async () => {
    const response = await fetch(
      "https://www.contextify.info/api/user/categories/?extension=true",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          secret: await storage.get("key")
        }
      }
    )
    const result = await response.json()
    console.log(result.categories)
    setAlltypes(result.categories)
  }

  const handleVoiceChange = async (event) => {
    setVoice(event.target.value)
    await storage.set("voice", event.target.value)
  }

  const fetchVoices = async () => {
    const voices = speechSynthesis.getVoices()
    setVoices(voices)
    console.log(voices)
  }

  useEffect(() => {
    setTimeout(() => {
      fetchVoices()
    }, 2000)
  }, [setting])

  const customNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack"
    // Add more names if needed
  ]

  const handleSpeech = () => {
    if (result) {
      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(result)
      const voices = speechSynthesis.getVoices()
      const selectedVoice = voice || 1
      utterance.voice = voices[selectedVoice]
      synth.speak(utterance)
      setSpeechSynthesisInstance(synth)
      setIsSpeaking(true)
      setIsPaused(false)
    }
  }

  const handlePause = () => {
    if (speechSynthesisInstance && isSpeaking) {
      speechSynthesisInstance.pause()
      setIsPaused(true)
    }
  }

  const handleResume = () => {
    if (speechSynthesisInstance && isPaused) {
      speechSynthesisInstance.resume()
      setIsPaused(false)
    }
  }

  const handleCancel = () => {
    if (speechSynthesisInstance) {
      speechSynthesisInstance.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }
  async function contextify(url = "", data = {}) {
    try {
      console.log("first")
      setResult("")
      setIsPaused(false)
      setIsSpeaking(false)
      handleCancel()
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          secret: await storage.get("key")
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      setResult(result?.data?.replaceAll("#", ""))
      if (result?.err) {
        setResult(result.err)
      }
    } catch (error) {
      console.error(error)
      setResult("error something went wrong, please try again later")
    }
  }

  const getVoice = async () => {
    const voice = await storage.get("voice")
    setVoice(voice)
  }

  useEffect(() => {
    getVoice()
    handleTypes()
  }, [])

  useEffect(() => {
    if (searchedText) {
      contextify("https://www.contextify.info/api/context/contextify", {
        text: searchedText,
        isImg: isImg
      })
    }
  }, [searchedText])

  const handleSave = async () => {
    if (result) {
      try {
        const response = await fetch(
          "https://www.contextify.info/api/context/save",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              secret: await storage.get("key")
            },
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
        setResult("error something went wrong, please try again later")
      }
    }
  }

  const handleFeedbackSubmit = async () => {
    const response = await fetch(
      "https://www.contextify.info/api/client/feedback/?extension=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          secret: await storage.get("key")
        },
        body: JSON.stringify(feedback)
      }
    )
    const res = await response.json()
    setFeedbackModal(false)
    setFeedback({ rating: "", comment: "", idea: "" })
  }

  return searchedText ? (
    <>
      {feedbackModal ? (
        <>
          <div className="panel-container">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} height={40} width={40} alt="" />
              <p className="logo-label">Contextify</p>
            </div>
            <hr />
            <div className="options">
              <p
                style={{
                  margin: "10px",
                  display: "flex",
                  alignItems: "center"
                }}
                onClick={() => setFeedbackModal(false)}>
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
            <h3 style={{ textAlign: "center" }}>Feedback</h3>

            <div style={{ width: "100%" }}>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <p>What did you think about Contextify?</p>
                {feedback?.rating === "1" ? (
                  <img
                    src={likef}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#6B7280"
                    }}
                  />
                ) : (
                  <img
                    src={like}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#6B7280"
                    }}
                    onClick={() => setFeedback({ ...feedback, rating: "1" })}
                  />
                )}
                {feedback?.rating === "-1" ? (
                  <img
                    src={dislikef}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#6B7280"
                    }}
                  />
                ) : (
                  <img
                    src={dislike}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#6B7280"
                    }}
                    onClick={() => setFeedback({ ...feedback, rating: "-1" })}
                  />
                )}
              </div>
              <p>How has your experience been so far?</p>
              <textarea
                className="textarea"
                style={{
                  backgroundColor: "#f7f0fc",
                  height: "100px",
                  fontSize: "12px"
                }}
                onChange={(e) => {
                  setFeedback({ ...feedback, comment: e.target.value })
                }}></textarea>
              <p>How can we make Contextify better for you?</p>
              <textarea
                className="textarea"
                style={{
                  backgroundColor: "#f7f0fc",
                  height: "100px",
                  fontSize: "12px"
                }}
                onChange={(e) => {
                  setFeedback({ ...feedback, idea: e.target.value })
                }}></textarea>

              <button
                className="save-button"
                style={{ margin: "10px 4px" }}
                onClick={handleFeedbackSubmit}>
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
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
                  select your preferred note type to save
                </p>

                <div className="typeContainer">
                  {alltypes?.map((t) => (
                    <div
                      onClick={() => setType(t)}
                      className={`${type === t ? "active" : "inactive"}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="button-box">
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} height={40} width={40} alt="" />
            <p className="logo-label">Contextify</p>
          </div>
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                <p
                  style={{ margin: "10px", cursor: "pointer" }}
                  onClick={() => setFeedbackModal(true)}>
                  Feedback
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p
                    style={{ margin: "10px", cursor: "pointer" }}
                    onClick={() => setOpenModal(true)}>
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
              </div>
              <div className="main-body">
                <textarea
                  className="textarea"
                  placeholder="loading please wait...."
                  value={result}
                  style={{ backgroundColor: "#f7f0fc" }}
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
              <div>
                <div className="main-body">
                  <section style={{ padding: "10px 1rem " }}>
                    <label
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginBottom: "10px"
                      }}
                      htmlFor="voiceType">
                      Select Voice:
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: ".5rem",
                        border: "1px solid gray",
                        borderRadius: ".5rem",
                        marginTop: "10px"
                      }}
                      id="voiceType"
                      value={voice}
                      onChange={handleVoiceChange}>
                      {voices?.map((voice, i) => (
                        <option key={voice.voiceURI} value={i}>
                          {customNames[i] || voice.name}
                        </option>
                      ))}
                    </select>
                  </section>
                  <hr />
                </div>
                <div className="unlock-container">
                  <a
                    href="https://www.contextify.info/subscription"
                    target="_blank"
                    className="unlock2">
                    <div className="diamond">
                      <img src={diamond} width={20} alt="" />
                    </div>
                    Unlock Premium
                  </a>
                </div>
              </div>
            </>
          )}
          <footer className="footer">
            {!isSpeaking && !isPaused && (
              <div className="footer-button" onClick={handleSpeech}>
                <img src={speak} width={20} height={20} alt="" /> Voice
              </div>
            )}
            <div className="footer-button">
              {isSpeaking && !isPaused && (
                <img
                  src={pause}
                  width={20}
                  height={20}
                  alt=""
                  onClick={handlePause}
                />
              )}
              {isPaused && (
                <img
                  src={play}
                  width={20}
                  height={20}
                  onClick={handleResume}
                  alt=""
                />
              )}
              {(isSpeaking || isPaused) && (
                <img
                  src={cancel}
                  width={20}
                  height={20}
                  onClick={handleCancel}
                  alt=""
                />
              )}
            </div>
            <div className="footer-button">
              <img src={dashboard} width={20} height={20} alt="" />
              <a
                style={{ textDecoration: "none" }}
                href="https://www.contextify.info/dashboard"
                target="_blank"
                rel="noopener noreferrer">
                Dashboard
              </a>
            </div>
          </footer>
          <p
            style={{
              fontSize: "12px",
              textAlign: "center",
              fontWeight: "bold"
            }}>
            Powered By:{" "}
            <a href="https://www.contextify.info" target="_blank">
              contextify.info
            </a>
          </p>
        </div>
      )}
    </>
  ) : (
    <>loading...</>
  )
}

export default IndexSidePanel
