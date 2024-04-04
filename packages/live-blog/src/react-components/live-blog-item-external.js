import { useState, useRef } from 'react'
import styled from 'styled-components'
import { liveblogItemId } from '../utils/anchor-scroll-helper'
import LiveBlogBottomActions from './live-blog-bottom-actions'
import LiveBlogItemContent from './live-blog-item-content'
import LiveBlogItemHeader from './live-blog-item-header'
import LiveBlogTopActions from './live-blog-top-actions'

const Wrapper = styled.div`
  cursor: pointer;
`

const LiveBlogItemWrapper = styled.div`
  position: relative;
  background-color: ${(props) => (props.pined ? '#fdf6ec' : '#fff')};
  margin-top: 40px;
  &:hover,
  &:focus {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    margin-top: 28px;
  }
`

const LiveBlogWrapper = styled.div`
  border: 1px solid #000;
  padding: 20px 12px 56px 12px;

  @media (max-width: 768px) {
    padding: 28px 12px 56px 12px;
  }
`

const LiveBlog = styled.div`
  overflow: hidden;
`

export default function LiveBlogItemExternal({
  pined,
  article,
  fetchImageBaseUrl,
  onChange,
}) {
  const [expanded, setExpanded] = useState(false)
  const [hideExpandButton, setHideExpandButton] = useState(false)
  const wrapperRef = useRef()

  const expandClickedHandler = (e) => {
    e.stopPropagation()
    setExpanded((expanded) => !expanded)
    onChange({
      eventName: 'Click',
      eventTarget: '繼續閱讀按鈕',
      eventValue: expanded ? '展開較少' : '繼續閱讀',
      metadata: {
        article: {
          title: article.title,
        },
      },
    })
  }

  const openExternalLinkHandler = () => {
    window.open(article.external, '_blank')
    onChange({
      eventName: 'Click',
      eventTarget: '外連按鈕',
      metadata: {
        article: {
          title: article.title,
          url: article.external,
        },
      },
    })
  }

  return (
    <Wrapper id={`${liveblogItemId(article.id)}`} ref={wrapperRef}>
      <LiveBlogItemWrapper
        pined={pined}
        onClick={(e) => {
          e.stopPropagation()
          openExternalLinkHandler()
        }}
      >
        <LiveBlogTopActions pined={pined} id={article.id} type={article.type} />
        <LiveBlogWrapper>
          <LiveBlog>
            <LiveBlogItemHeader article={article} />
            <LiveBlogItemContent
              article={article}
              expanded={expanded}
              fetchImageBaseUrl={fetchImageBaseUrl}
              contentTooShort={setHideExpandButton}
            />
          </LiveBlog>
        </LiveBlogWrapper>
        {!hideExpandButton && (
          <LiveBlogBottomActions
            onClick={expandClickedHandler}
            expanded={expanded}
          />
        )}
      </LiveBlogItemWrapper>
    </Wrapper>
  )
}
