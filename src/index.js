console.log('!')

const scrollElement = document.getElementById('map-wrapper')
let zoom = 'normal'
const objects = JSON.parse(localStorage.getItem('mapDatas')) || []
{
  const element = document.getElementById('map')
  for (var i = 0; i < 400; i++) {
    const number = String(i + 1).padStart(3, '0')
    const name = `mapPart${number}`
    const img = document.createElement('img')
    img.src = `t4/image_part_${number}.png`
    img.id = name
    img.alt = name
    img.addEventListener('mousedown', (e) => { e.preventDefault() })
    element.appendChild(img)
  }
}

{
  const element = scrollElement
  const convertPoint = (x, y) => {
    if (zoom === 'normal') {
      return [x, y]
    } else {
      return [x * 2, y * 2]
    }
  }
  const createObjectByClick = (e) => {
    let [x, y] = convertPoint(
      scrollElement.scrollLeft + e.clientX,
      scrollElement.scrollTop + e.clientY,
    )
    const id = new Array(4).fill(0).map(() => (
      Math.random().toString(16).slice(2, 10)
    )).join('')
    pointsComponent.setState(
      ({ points }) => {
        const point = { id, x, y, color: '#9e5656', name: '' }
        return { currentEditPoint: point, points: [...points, point] }
      },
      () => { localStorage.setItem('mapDatas', JSON.stringify(pointsComponent.state.points)) }
    )
  }
  element.addEventListener('dblclick', createObjectByClick)
  window.setEdit = (e, id) => {
    pointsComponent.setState(
      ({ points }) => {
        const point = points.find(point => (point.id === id))
        return { currentEditPoint: point }
      },
    )
  }
  window.setEditValue = (key, value) => {
    pointsComponent.setState(
      ({ currentEditPoint }) => {
        currentEditPoint[key] = value
        return { currentEditPoint }
      },
      () => { localStorage.setItem('mapDatas', JSON.stringify(pointsComponent.state.points)) }
    )
  }
  window.closeEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    pointsComponent.setState({ currentEditPoint: {} })
  }
  window.removeEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    pointsComponent.setState(
      ({ currentEditPoint, points }) => {
        const newPoints = []
        points.forEach((point) => {
          if (point.id !== currentEditPoint.id) {
            newPoints.push(point)
          }
        })
        return { currentEditPoint: {}, points: newPoints }
      },
      () => { localStorage.setItem('mapDatas', JSON.stringify(pointsComponent.state.points)) }
    )
  }
  window.goCenter = (e, id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ block: 'center' })
    }
  }
  window.getColorsAndSearched = (points, search) => {
    let result = []
    let colors = []
    points.sort((a, b) => (b.color < a.color ? 1 : -1)).forEach((e) => {
      if (colors.length < 10 && !colors.includes(e.color)) {
        colors.push(e.color)
      }
      if (e.name.includes(search)) {
        result.push(e)
      }
    })
    return [result, colors]
  }
}

{
  document.addEventListener('keydown', (e) => {
    if (e.key === 'z') {
      const width = scrollElement.clientWidth
      const height = scrollElement.clientHeight
      const x = scrollElement.scrollLeft + scrollElement.clientWidth / 2
      const y = scrollElement.scrollTop + scrollElement.clientHeight / 2
      if (zoom === 'normal') {
        scrollElement.scrollLeft = x / 2 - scrollElement.clientWidth / 2
        scrollElement.scrollTop = y / 2 - scrollElement.clientHeight / 2
        document.body.classList.add('small')
        zoom = 'small'
      } else {
        document.body.classList.remove('small')
        scrollElement.scrollLeft = x * 2 - scrollElement.clientWidth / 2
        scrollElement.scrollTop = y * 2 - scrollElement.clientHeight / 2
        zoom = 'normal'
      }
    } else if (e.key === 'Alt') {
      e.preventDefault()
      document.body.classList.toggle('show-name')
    }
  })
}

{
  const element = scrollElement
  let look = false
  let position = {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
  }
  const mouseDownHandler = (e) => {
    if (e.button !== 1) {
      return
    }
    e.preventDefault()
    position = {
      left: element.scrollLeft,
      top: element.scrollTop,
      x: e.clientX,
      y: e.clientY,
      mx: 0,
      my: 0,
    }
    look = true
  }
  const mouseMoveHandler = (e) => {
    if (!look) {
      return
    }
    const width = element.clientWidth
    const height = element.clientHeight
    const dx = e.clientX - position.x
    const dy = e.clientY - position.y
    element.scrollTop = position.top - dy
    element.scrollLeft = position.left - dx
    const gap = 5
    if (e.clientX < gap || e.clientY < gap || e.clientX > width - gap || e.clientY > height - gap) {
      look = false
    }
  }
  const mouseUpHandler = (e) => {
    look = false
  }
  element.addEventListener('mousedown', mouseDownHandler)
  element.addEventListener('mousemove', mouseMoveHandler)
  element.addEventListener('mouseup', mouseUpHandler)
}

{
  if (location.hash) {
    const element = document.querySelector(location.hash)
    if (element) {
      element.scrollIntoView({ block: 'center' })
    }
  }
}
