import { Breadcrumb } from 'antd'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function MyBreadcrumb() {
	const location = useLocation()

	const pathSnippets = location.pathname.split('/').filter((i) => i)
	const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
		return (
			<Breadcrumb.Item key={url}>
				<Link to={url}>{breadcrumbNameMap[url]}</Link>
			</Breadcrumb.Item>
		)
	})

	return <div>MyBreadcrumb</div>
}
