// Theirs
import React from 'react'
import { withRouter } from 'next/router'
import { register, unregister } from 'next-offline/runtime'
import Either from 'eitherx'

// Ours
import EditorContainer from '../components/EditorContainer'
import Page from '../components/Page'
import { MetaLinks } from '../components/Meta'

class Index extends React.Component {
  componentDidMount() {
    register()
  }
  componentWillUnmount() {
    unregister()
  }

  shouldComponentUpdate = () => false

  render() {
    return (
      <Page enableHeroText={true}>
        <EditorContainer router={this.props.router} snippet={this.props.snippet} />
      </Page>
    )
  }
}

export default withRouter(Index)
