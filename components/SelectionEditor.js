import React from 'react'
import Popout from './Popout'
import Button from './Button'
import ColorPicker from './ColorPicker'
import { COLORS } from '../lib/constants'
import { useKeyboardListener } from 'actionsack'

function ModifierButton(props) {
  return (
    <Button
      flex={0}
      padding="0"
      center
      margin="0 8px 0 0"
      style={{ borderBottom: `1px solid ${props.selected ? 'white' : 'transparent'}` }}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'BOLD': {
      return {
        ...state,
        bold: !state.bold
      }
    }
    case 'ITALICS': {
      return {
        ...state,
        italics: !state.italics
      }
    }
    case 'UNDERLINE': {
      return {
        ...state,
        underline: !state.underline
      }
    }
    case 'COLOR': {
      return {
        ...state,
        color: action.color
      }
    }
  }
  throw new Error('Invalid action')
}

function SelectionEditor({ position, onChange, onClose }) {
  useKeyboardListener('Escape', onClose)
  const [open, setOpen] = React.useState(false)

  const [state, dispatch] = React.useReducer(reducer, {
    bold: false,
    italics: false,
    underline: false,
    color: null
  })

  React.useEffect(() => {
    onChange(state)
  }, [onChange, state])

  return (
    <Popout
      hidden={false}
      pointerLeft="62px"
      style={{
        zIndex: 100,
        top: position.top,
        left: position.left
      }}
    >
      <div className="colorizer">
        <div className="modifier">
          <ModifierButton selected={state.bold} onClick={() => dispatch({ type: 'BOLD' })}>
            <b>B</b>
          </ModifierButton>
          <ModifierButton selected={state.italics} onClick={() => dispatch({ type: 'ITALICS' })}>
            <i>I</i>
          </ModifierButton>
          <ModifierButton
            selected={state.underline}
            onClick={() => dispatch({ type: 'UNDERLINE' })}
          >
            <u>U</u>
          </ModifierButton>
          <button className="color-square" onClick={() => setOpen(o => !o)} />
        </div>
        {open && (
          <div className="color-picker-container">
            <ColorPicker
              color={state.color || COLORS.PRIMARY}
              disableAlpha={true}
              onChange={d => dispatch({ type: 'COLOR', color: d.hex })}
            />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .modifier {
            padding: 0px 8px;
            display: flex;
          }
          .colorizer b {
            font-weight: bold;
          }
          .colorizer i {
            font-style: italic;
          }
          .colorizer :global(button) {
            min-width: 24px;
          }
          .color-square {
            cursor: pointer;
            appearance: none;
            outline: none;
            border: none;
            border-radius: 3px;
            padding: 12px;
            margin: 4px 0 4px auto;
            background: ${state.color || COLORS.PRIMARY};
            box-shadow: ${`inset 0px 0px 0px ${open ? 2 : 1}px ${COLORS.SECONDARY}`};
          }
          .color-picker-container {
            width: 218px;
            border-top: 2px solid ${COLORS.SECONDARY};
          }
        `}
      </style>
    </Popout>
  )
}

export default SelectionEditor
