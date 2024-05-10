import { useEffect, useMemo, useRef, useState } from 'react'
import {
  LuPencil,
  LuMousePointer2,
  LuRectangleHorizontal,
  LuEraser,
  LuSave,
  LuZoomIn,
  LuZoomOut
} from 'react-icons/lu'
import { CiText } from 'react-icons/ci'
import { FaSlash } from 'react-icons/fa'
import { GrPan } from 'react-icons/gr'
import { Layer, Line, Rect, Text, Stage, Transformer } from 'react-konva'
import Konva from 'konva'
import { v4 as uuidV4 } from 'uuid'
import { KonvaEventObject } from 'konva/lib/Node'
import { useAppContext } from '@renderer/store/AppContext'
import { Vector2d } from 'konva/lib/types'

enum TOOLS {
  SELECT,
  PENCIL,
  RECTANGLE,
  LINE,
  TEXT,
  ERASER,
  PAN,
  ZOOMIN,
  ZOOMOUT
}

enum SHAPES {
  RECTANGLE,
  LINE,
  FREE,
  TEXT
}

type Rectangle = {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  offsetX?: number
  offsetY?: number
}

type FreeDrawElement = {
  id: string
  points: number[]
  x?: number
  y?: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  offsetX?: number
  offsetY?: number
}

type Line = FreeDrawElement

type Text = {
  id: string
  text: string
  x: number
  y: number
  rotation?: number
  scaleX?: number
  scaleY?: number
  skewX?: number
  skewY?: number
  offsetX?: number
  offsetY?: number
}

export const SketchPad = () => {
  const { updateProjectCanvas, projectCanvasData } = useAppContext()
  const canvasRef = useRef<Konva.Stage | null>(null)
  const layerRef = useRef<Konva.Layer | null>(null)
  const [stageXY, setStageXY] = useState<Vector2d>({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState<Vector2d>({ x: 1, y: 1 })
  const [tool, setTool] = useState<TOOLS>(TOOLS.SELECT)
  const [rectangles, setRectangles] = useState<Rectangle[]>([])
  const [freeDrawElements, setFreeDrawElements] = useState<FreeDrawElement[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [texts, setTexts] = useState<Text[]>([])
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isTextMode, setIsTextMode] = useState<boolean>(false)
  const [currentElementId, setCurrentElementId] = useState<string>('')
  const [currentElement, setCurrentElement] = useState<Text | null>(null)
  const transformerRef = useRef<Konva.Transformer | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const initSketchPad = () => {
      if (!projectCanvasData) return

      const rectangleData: Rectangle[] = []
      const linesData: Line[] = []
      const pencilData: FreeDrawElement[] = []
      const textData: Text[] = []
      const stageData = JSON.parse(projectCanvasData)
      setStageXY({ x: stageData.attrs.x, y: stageData.attrs.y })
      setStageScale({ x: 1, y: 1 })
      const layerData = stageData.children[0]
      const elements = layerData.children
      elements.forEach((element, index) => {
        if (index >= 0 && index < elements.length - 1) {
          if (element.className === 'Rect') {
            const { id, x, y, width, height, ...rest } = element.attrs
            rectangleData.push({
              id,
              x,
              y,
              width,
              height,
              ...rest
            })
          } else if (element.className === 'Line') {
            const { id, points, ...rest } = element.attrs
            if (points.length === 4) {
              linesData.push({
                id,
                points,
                ...rest
              })
            } else if (points.length > 4) {
              pencilData.push({
                id,
                points,
                ...rest
              })
            }
          } else if (element.className === 'Text') {
            const { id, x, y, text, ...rest } = element.attrs
            textData.push({
              id,
              x,
              y,
              text,
              ...rest
            })
          }
        }
      })
      setRectangles(rectangleData)
      setLines(linesData)
      setFreeDrawElements(pencilData)
      setTexts(textData)
    }
    initSketchPad()
  }, [])

  useEffect(() => {
    if (!transformerRef.current) return

    if (tool !== TOOLS.SELECT && transformerRef.current.getNodes().length > 0) {
      transformerRef.current.nodes([])
    }
  }, [tool])

  const isDraggable = useMemo(() => tool === TOOLS.SELECT, [tool])

  const stagePan = useMemo(() => tool === TOOLS.PAN, [tool])

  useEffect(() => {
    if (!canvasRef.current) return

    stagePan
      ? (canvasRef.current.container().style.cursor = 'move')
      : (canvasRef.current.container().style.cursor = 'default')
  }, [stagePan])

  const handleMouseDown = () => {
    if (isTextMode) return

    if (tool === TOOLS.SELECT) return

    if (tool === TOOLS.TEXT) {
      setIsTextMode(true)
    }

    setIsDrawing(true)
    const stage = canvasRef.current
    if (!stage) return

    const position = stage.getRelativePointerPosition()
    if (!position) return
    const { x, y } = position
    const id = uuidV4()
    setCurrentElementId(id)

    switch (tool) {
      case TOOLS.RECTANGLE:
        setRectangles((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            height: 1,
            width: 1
          }
        ])
        break
      case TOOLS.PENCIL:
        setFreeDrawElements((prev) => [
          ...prev,
          {
            id,
            points: [x, y]
          }
        ])
        break
      case TOOLS.LINE:
        setLines((prev) => [
          ...prev,
          {
            id,
            points: [x, y]
          }
        ])
        break
      case TOOLS.TEXT:
        setTexts((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            text: 'Enter text'
          }
        ])
        setCurrentElement({
          id,
          x,
          y,
          text: 'Enter text'
        })
    }
  }

  const handleMouseMove = () => {
    if (tool === TOOLS.SELECT || !isDrawing) return

    const stage = canvasRef.current
    if (!stage) return

    const position = stage.getRelativePointerPosition()
    if (!position) return
    const { x, y } = position

    switch (tool) {
      case TOOLS.RECTANGLE:
        setRectangles((prev) =>
          prev.map((rectangle) => {
            if (rectangle.id === currentElementId) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y
              }
            }
            return rectangle
          })
        )
        break
      case TOOLS.PENCIL:
        setFreeDrawElements((prev) =>
          prev.map((freeDrawElement) => {
            if (freeDrawElement.id === currentElementId) {
              return {
                ...freeDrawElement,
                points: [...freeDrawElement.points, x, y]
              }
            }
            return freeDrawElement
          })
        )
        break
      case TOOLS.LINE:
        setLines((prev) =>
          prev.map((line) => {
            if (line.id === currentElementId) {
              return {
                ...line,
                points: [line.points[0], line.points[1], x, y]
              }
            }
            return line
          })
        )
        break
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    if (isTextMode) {
      const textArea = textAreaRef.current
      if (!textArea) return
      if (isTextMode) {
        // console.log('Entered textarea', textArea)
        textArea.focus()
      }
    }
  }

  const handleDragStart = (id: string) => {
    setCurrentElementId(id)
  }

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, shape: SHAPES) => {
    // console.log('DragEnd', e.target.attrs)

    switch (shape) {
      case SHAPES.RECTANGLE:
        setRectangles((prev) =>
          prev.map((rectangle) => {
            if (rectangle.id === currentElementId) {
              const { x, y, ...rest } = e.target.attrs
              return {
                ...rectangle,
                x,
                y,
                ...rest
              }
            }
            return rectangle
          })
        )
        break
      case SHAPES.FREE:
        setFreeDrawElements((prev) =>
          prev.map((freeDrawElement) => {
            if (freeDrawElement.id === currentElementId) {
              const { points, ...rest } = e.target.attrs
              return {
                ...freeDrawElement,
                points,
                ...rest
              }
            }
            return freeDrawElement
          })
        )
        break
      case SHAPES.LINE:
        setLines((prev) =>
          prev.map((line) => {
            if (line.id === currentElementId) {
              const { points, ...rest } = e.target.attrs
              return {
                ...line,
                points,
                ...rest
              }
            }
            return line
          })
        )
        break
      case SHAPES.TEXT:
        setTexts((prev) =>
          prev.map((textEl) => {
            if (textEl.id === currentElementId) {
              const { x, y, ...rest } = e.target.attrs
              return {
                ...textEl,
                x,
                y,
                ...rest
              }
            }
            return textEl
          })
        )
        break
    }
  }

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === TOOLS.ERASER) {
      // console.log("Clicked Erase", e)
      let type = e.target.className
      if (type === 'Line' && e.target.attrs.points.length > 4) {
        type = 'Free'
      }
      if (type === 'Rect') {
        setRectangles(rectangles.filter((rectangle) => rectangle.id !== e.target.attrs.id))
      } else if (type === 'Line') {
        setLines(lines.filter((line) => line.id !== e.target.attrs.id))
      } else if (type === 'Free') {
        setFreeDrawElements(
          freeDrawElements.filter((freeDrawElement) => freeDrawElement.id !== e.target.attrs.id)
        )
      } else if (type === 'Text') {
        setTexts(texts.filter((text) => text.id !== e.target.attrs.id))
      }
      const container = e.target.getStage()?.container()
      if (!container) return
      container.style.cursor = 'default'
    } else if (tool === TOOLS.SELECT) {
      const target = e.currentTarget
      transformerRef.current?.nodes([target])
      e.cancelBubble = true
    }
  }

  const handleTransformStart = (id: string) => {
    setCurrentElementId(id)
  }

  const handleTransformEnd = (e: KonvaEventObject<Event>, shape: SHAPES) => {
    console.log('TransformEnd', e.target.attrs)
    // console.log(canvasRef.current?.toJSON())

    switch (shape) {
      case SHAPES.RECTANGLE:
        setRectangles((prev) =>
          prev.map((rectangle) => {
            if (rectangle.id === currentElementId) {
              const { x, y, ...rest } = e.target.attrs
              return {
                ...rectangle,
                x,
                y,
                ...rest
              }
            }
            return rectangle
          })
        )
        break
      case SHAPES.FREE:
        setFreeDrawElements((prev) =>
          prev.map((freeDrawElement) => {
            if (freeDrawElement.id === currentElementId) {
              const { points, ...rest } = e.target.attrs
              return {
                ...freeDrawElement,
                points,
                ...rest
              }
            }
            return freeDrawElement
          })
        )
        break
      case SHAPES.LINE:
        setLines((prev) =>
          prev.map((line) => {
            if (line.id === currentElementId) {
              const { points, ...rest } = e.target.attrs
              return {
                ...line,
                points,
                ...rest
              }
            }
            return line
          })
        )
        break
      case SHAPES.TEXT:
        setTexts((prev) =>
          prev.map((textEl) => {
            if (textEl.id === currentElementId) {
              const { x, y, ...rest } = e.target.attrs
              return {
                ...textEl,
                x,
                y,
                ...rest
              }
            }
            return textEl
          })
        )
        break
    }
  }

  const handleLayerMouseOver = (e: KonvaEventObject<MouseEvent>) => {
    if (tool !== TOOLS.ERASER) return
    // console.log('Mouse over', e)
    if (e.target.attrs.id && ['Rect', 'Line', 'Text'].includes(e.target.className)) {
      // console.log('Target ', e.target)
      let type = e.target.className
      if (type === 'Line' && e.target.attrs.points.length > 4) {
        type = 'Free'
      }

      const elementNode = e.target as Konva.Shape
      // console.log('Node', elementNode)
      elementNode.shadowEnabled(true)
      elementNode.shadowBlur(10)
      elementNode.shadowOpacity(0.5)

      const container = elementNode.getStage()?.container()
      if (!container) return
      container.style.cursor = 'pointer'
    }
  }

  const handleLayerMouseOut = (e: KonvaEventObject<MouseEvent>) => {
    if (tool !== TOOLS.ERASER) return
    // console.log('Mouse out', e)
    if (e.target.attrs.id && ['Rect', 'Line', 'Text'].includes(e.target.className)) {
      // console.log('Target ', e.target.className)
      let type = e.target.className
      if (type === 'Line' && e.target.attrs.points.length > 4) {
        type = 'Free'
      }

      const elementNode = e.target as Konva.Shape
      // console.log('Node', elementNode)
      elementNode.shadowEnabled(false)
      const container = elementNode.getStage()?.container()
      if (!container) return
      container.style.cursor = 'default'
    }
  }

  const handleOnBlur = () => {
    // console.log("Commit changes");
    if (!currentElement) return
    const { id } = currentElement
    setTexts(
      texts.map((textEl) => {
        if (textEl.id === id) {
          return {
            ...textEl,
            text: currentElement.text
          }
        }
        return textEl
      })
    )
    setCurrentElement(null)
    setIsTextMode(false)
    setTool(TOOLS.SELECT)
  }

  const handleDblClick = (event: KonvaEventObject<MouseEvent>) => {
    if (tool !== TOOLS.SELECT) return

    const { className } = event.target
    if (className !== 'Text') return

    // console.log("Here", event.target)

    const textElement = texts.find((text) => text.id === event.target.attrs.id)
    setIsTextMode(true)
    setCurrentElement(textElement ?? null)
  }

  const saveCanvas = () => {
    const stageJson = canvasRef.current?.toJSON()
    if (!stageJson) return
    updateProjectCanvas(stageJson)
  }

  const handleZoom = (scale: number) => {
    if (!canvasRef.current) return

    if (stageScale.x + scale > 0.2 && stageScale.x + scale < 1.9) {
      setStageScale({ x: stageScale.x + scale, y: stageScale.y + scale })
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute h-14 w-[70%] border-[1px] p-2 flex flex-row items-center justify-around z-10 inset-0 mx-auto mt-2 rounded-md bg-slate-200">
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.SELECT ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.SELECT)}
        >
          <LuMousePointer2 />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.PENCIL ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.PENCIL)}
        >
          <LuPencil />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.RECTANGLE ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.RECTANGLE)}
        >
          <LuRectangleHorizontal />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.LINE ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.LINE)}
        >
          <FaSlash />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.TEXT ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.TEXT)}
        >
          <CiText />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.ERASER ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.ERASER)}
        >
          <LuEraser />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700`}
          onClick={saveCanvas}
        >
          <LuSave />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700 ${tool === TOOLS.PAN ? 'bg-gray-500 border-zinc-700' : ''}`}
          onClick={() => setTool(TOOLS.PAN)}
        >
          <GrPan />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700`}
          onClick={() => handleZoom(0.1)}
        >
          <LuZoomIn />
        </div>
        <div
          className={`h-8 w-8 rounded-md border-[2px] bg-black border-zinc-500 flex justify-center items-center hover:cursor-pointer hover:bg-gray-500 hover:border-zinc-700`}
          onClick={() => handleZoom(-0.1)}
        >
          <LuZoomOut />
        </div>
      </div>
      {isTextMode && currentElement ? (
        <textarea
          onBlur={handleOnBlur}
          value={currentElement.text}
          onChange={(e) => setCurrentElement({ ...currentElement, text: e.target.value })}
          ref={textAreaRef}
          className={`absolute z-10 rounded-md p-2 resize-none bg-[#f1f1f1] text-sm text-black border-[1px] border-black`}
          style={{
            top: stageXY.y + currentElement.y * stageScale.y,
            left: stageXY.x + currentElement.x * stageScale.x
          }}
        />
      ) : null}

      <Stage
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        x={stageXY.x}
        y={stageXY.y}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: 'white' }}
        draggable={stagePan}
        onDragEnd={(e) => {
          setStageXY({ x: e.currentTarget.attrs.x, y: e.currentTarget.attrs.y })
        }}
        onClick={() => {
          if (tool === TOOLS.SELECT) {
            if (transformerRef.current) {
              transformerRef.current?.nodes([])
            }
          }
        }}
      >
        <Layer onMouseOver={handleLayerMouseOver} onMouseOut={handleLayerMouseOut} ref={layerRef}>
          {rectangles.map((rectangle) => {
            return (
              <Rect
                id={rectangle.id}
                key={rectangle.id}
                x={rectangle.x}
                y={rectangle.y}
                stroke={'#000000'}
                strokeWidth={2}
                height={rectangle.height}
                width={rectangle.width}
                rotation={rectangle.rotation ?? 0}
                scaleX={rectangle.scaleX ?? 1}
                scaleY={rectangle.scaleY ?? 1}
                skewX={rectangle.skewX ?? 0}
                skewY={rectangle.skewY ?? 0}
                offsetX={rectangle.offsetX ?? 0}
                offsetY={rectangle.offsetY ?? 0}
                draggable={isDraggable}
                onDragStart={() => handleDragStart(rectangle.id)}
                onDragEnd={(e) => handleDragEnd(e, SHAPES.RECTANGLE)}
                onClick={(e) => handleClick(e)}
                onTransformStart={() => handleTransformStart(rectangle.id)}
                onTransformEnd={(e) => handleTransformEnd(e, SHAPES.RECTANGLE)}
              />
            )
          })}
          {freeDrawElements.map((freeDrawElement) => {
            return (
              <Line
                id={freeDrawElement.id}
                key={freeDrawElement.id}
                stroke={'#000000'}
                strokeWidth={2}
                points={freeDrawElement.points}
                x={freeDrawElement.x ?? 0}
                y={freeDrawElement.y ?? 0}
                rotation={freeDrawElement.rotation ?? 0}
                scaleX={freeDrawElement.scaleX ?? 1}
                scaleY={freeDrawElement.scaleY ?? 1}
                skewX={freeDrawElement.skewX ?? 0}
                skewY={freeDrawElement.skewY ?? 0}
                offsetX={freeDrawElement.offsetX ?? 0}
                offsetY={freeDrawElement.offsetY ?? 0}
                draggable={isDraggable}
                onDragStart={() => handleDragStart(freeDrawElement.id)}
                onDragEnd={(e) => handleDragEnd(e, SHAPES.FREE)}
                onClick={(e) => handleClick(e)}
                onTransformStart={() => handleTransformStart(freeDrawElement.id)}
                onTransformEnd={(e) => handleTransformEnd(e, SHAPES.FREE)}
              />
            )
          })}
          {lines.map((line) => {
            return (
              <Line
                id={line.id}
                key={line.id}
                stroke={'#000000'}
                strokeWidth={2}
                points={line.points}
                x={line.x ?? 0}
                y={line.y ?? 0}
                rotation={line.rotation ?? 0}
                scaleX={line.scaleX ?? 1}
                scaleY={line.scaleY ?? 1}
                skewX={line.skewX ?? 0}
                skewY={line.skewY ?? 0}
                offsetX={line.offsetX ?? 0}
                offsetY={line.offsetY ?? 0}
                draggable={isDraggable}
                onDragStart={() => handleDragStart(line.id)}
                onDragEnd={(e) => handleDragEnd(e, SHAPES.LINE)}
                onClick={(e) => handleClick(e)}
                onTransformStart={() => handleTransformStart(line.id)}
                onTransformEnd={(e) => handleTransformEnd(e, SHAPES.LINE)}
              />
            )
          })}
          {texts.map((text) => {
            return (
              <Text
                id={text.id}
                key={text.id}
                text={text.text}
                stroke={'#000000'}
                strokeWidth={1}
                x={text.x}
                y={text.y}
                rotation={text.rotation ?? 0}
                scaleX={text.scaleX ?? 1}
                scaleY={text.scaleY ?? 1}
                skewX={text.skewX ?? 0}
                skewY={text.skewY ?? 0}
                offsetX={text.offsetX ?? 0}
                offsetY={text.offsetY ?? 0}
                draggable={isDraggable}
                onDragStart={() => handleDragStart(text.id)}
                onDragEnd={(e) => handleDragEnd(e, SHAPES.TEXT)}
                onClick={(e) => handleClick(e)}
                onDblClick={(e) => handleDblClick(e)}
                onTransformStart={() => handleTransformStart(text.id)}
                onTransformEnd={(e) => handleTransformEnd(e, SHAPES.TEXT)}
              />
            )
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  )
}
