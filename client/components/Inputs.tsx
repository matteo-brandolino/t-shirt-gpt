"use client";
import Image from "next/image";
import inputStyle from "@/app/styles/inputs.module.scss";
import sendIcon from "/public/send.svg";
import { useContext, useRef, useState } from "react";
import useAutosizeTextArea from "@/app/hooks/useAutosizeTextArea";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import { TshirtContext } from "@/app/context/ThshirtContext";
import { TshirtContextType } from "@/types/ThishirtContextType";

export default function Inputs() {
  const { settings, setSettings } = useContext(
    TshirtContext
  ) as TshirtContextType;

  const [prompt, setPrompt] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, prompt);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setPrompt(val);
  };

  const handleClick = async (event) => {
    event.preventDefault();

    setSettings({
      ...settings,
      image: {
        ...settings.image,
        isLoading: true,
      },
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/create-image",
        {
          prompt,
        }
      );
      setSettings({
        ...settings,
        image: {
          ...settings.image,
          isLoading: false,
          url: response.data,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={inputStyle["inputs-container"]}>
      <form className={inputStyle["inputs-form"]}>
        <div className={inputStyle["inputs-div"]}>
          <textarea
            value={prompt}
            ref={textAreaRef}
            onChange={handleChange}
            rows={1}
            placeholder="Send a message"
            className={inputStyle["custom-input"]}
          ></textarea>
          <div>
            <Image
              onClick={handleClick}
              className={inputStyle["custom-icon"]}
              src={sendIcon}
              alt="send"
            />
          </div>
        </div>
      </form>
      <ColorPicker />
    </div>
  );
}
