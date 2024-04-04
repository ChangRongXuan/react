import styled, { css } from 'styled-components'

const Tag = styled('button')`
  padding: 0 8px;
  height: 24px;
  color: #666666;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid #000000;
  border-radius: 4px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-top: 10px;

  & div:last-child {
    margin-right: 0;
  }

  ${(props) =>
    props.active &&
    css`
      color: #ffffff;
      background-color: #000000;
    `}
`

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row;
  margin: 48px 0;

  @media (max-width: 768px) {
    margin: 28px 0;
  }
`

export default function LiveBlogTags({
  tags,
  activeTags,
  updateActiveTags,
  onChange,
}) {
  const handleClicked = (e) => {
    const clickedTagName = e.target.textContent
    if (activeTags.includes(clickedTagName)) {
      updateActiveTags(activeTags.filter((tag) => tag !== clickedTagName))
    } else {
      updateActiveTags([...activeTags, clickedTagName])
    }
    onChange({
      eventName: 'Click',
      eventTarget: 'tag 按鈕',
      eventValue: clickedTagName,
    })
  }

  return (
    <TagsWrapper>
      {tags.map((tag, index) => {
        return (
          <Tag
            key={index}
            active={activeTags.includes(tag)}
            onClick={handleClicked}
          >
            {tag}
          </Tag>
        )
      })}
    </TagsWrapper>
  )
}
