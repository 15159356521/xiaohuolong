// base64
export const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)

		reader.onload = () => resolve(reader.result)

		reader.onerror = (error) => reject(error)
	})

// 侧边栏数据转换
export const dealTreeData = (treeData) => {
	const data = treeData.map((item) => ({
		...item,
		// 新增title字段
		label: item.title,
		key: item.path === '' ? item.id : item.path,
		// 如果children为空数组，则置为null
		children:
			item.children && item.children.length
				? dealTreeData(item.children)
				: null,
	}))
	return data
}

export const mapTree = org => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    return {
        ...org,
        key: org.id+'',
		value: org.id,
		label:org.title,
        children:haveChildren ? org.children.map(i => mapTree(i)) : [],
     }
};