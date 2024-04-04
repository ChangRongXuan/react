import styled from 'styled-components'

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 34px;
  border: 1px solid black;
  background-color: rgb(217, 217, 217);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: -1px;
    top: -1px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border: 1px solid black;
    border-radius: 50%;
  }
`

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider}:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
  }
`

/**
 *
 * @param {Object} props
 * @param {(value: boolean) => void} props.onChange
 * @param {boolean} props.isOn
 * @returns {JSX.Element}
 */
export default function SeatsSwitch({ onChange, isOn }) {
  return (
    <Label>
      <Input
        type="checkbox"
        checked={isOn}
        onChange={(e) => {
          const switchOn = e.target.checked
          onChange(switchOn)
        }}
      />
      <Slider />
    </Label>
  )
}
