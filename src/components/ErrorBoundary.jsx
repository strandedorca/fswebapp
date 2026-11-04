import { Component } from 'react'
import { ErrorPage } from '../pages/ErrorPage.jsx'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <ErrorPage onRetry={() => this.setState({ failed: false })} />
    }
    return this.props.children
  }
}
