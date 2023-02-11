import type { Data, Fields } from "payload/dist/admin/components/forms/Form/types"

import { Modal, useModal } from "@faceless-ui/modal"
import { Button, MinimalTemplate, X } from "payload/components"
import { Form, Select, Submit, Text } from "payload/components/forms"
import { ElementButton } from "payload/components/rich-text"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlate } from "slate-react"

import VideoIcon from "../icon"

import "./index.scss"

const initialFormData = {
  source: "youtube",
}

const sources = [
  {
    label: "YouTube",
    value: "youtube",
  },
  {
    label: "Vimeo",
    value: "vimeo",
  },
]

const baseClass = "video-rich-text-button"

const insertVideo = (editor: any, { id, source }: { id: string; source: string }) => {
  const text = { text: " " }

  const video = {
    type: "video",
    id,
    source,
    children: [text],
  }

  const nodes = [video, { type: "p", children: [{ text: "" }] }]

  if (editor.blurSelection) {
    Transforms.select(editor, editor.blurSelection)
  }

  Transforms.insertNodes(editor, nodes)
  ReactEditor.focus(editor)
}

const VideoButton: React.FC<{ path: string }> = ({ path }) => {
  const { openModal, toggleModal } = useModal()
  const editor = useSlate()
  const [renderModal, setRenderModal] = useState(false)
  const modalSlug = `${path}-add-video`

  const handleAddVideo = useCallback(
    (_: Fields, { id, source }: Data) => {
      insertVideo(editor, { id, source })
      toggleModal(modalSlug)
      setRenderModal(false)
    },
    [editor, toggleModal],
  )

  useEffect(() => {
    if (renderModal) {
      openModal(modalSlug)
    }
  }, [renderModal, openModal, modalSlug])

  return (
    <Fragment>
      <ElementButton
        className={baseClass}
        format="video"
        onClick={(e) => {
          e.preventDefault()
          setRenderModal(true)
        }}
      >
        <VideoIcon />
      </ElementButton>
      {renderModal && (
        <Modal className={`${baseClass}__modal`} slug={modalSlug}>
          <MinimalTemplate className={`${baseClass}__template`}>
            <header className={`${baseClass}__header`}>
              <h3>Add Video</h3>
              <Button
                buttonStyle="none"
                onClick={() => {
                  toggleModal(modalSlug)
                  setRenderModal(false)
                }}
              >
                <X />
              </Button>
            </header>
            <Form initialData={initialFormData} onSubmit={handleAddVideo}>
              <Select label="Video Source" name="source" options={sources} required />
              <Text label="ID" name="id" required />
              <Submit>Add video</Submit>
            </Form>
          </MinimalTemplate>
        </Modal>
      )}
    </Fragment>
  )
}

export default VideoButton
