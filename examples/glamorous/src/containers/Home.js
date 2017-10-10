import React from 'react'
import { getSiteProps } from 'react-static'
//
export default getSiteProps(({ title }) => <h1>Welcome to {title}!</h1>)
