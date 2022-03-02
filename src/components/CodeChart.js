import React, { Component, useState } from 'react';
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { Modal, Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import shortid from "shortid";

import { ChartCanvas, Chart, ZoomButtons} from "react-stockcharts";
import {  BarSeries, AreaSeries, CandlestickSeries, LineSeries, MACDSeries} from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
  MouseCoordinateXV2,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
  OHLCTooltip,
  MovingAverageTooltip,
  MACDTooltip
} from "react-stockcharts/lib/tooltip";

import { ema, sma, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { InteractiveYCoordinate, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { getMorePropsForChart } from "react-stockcharts/lib/interactive/utils";
import algo from "react-stockcharts/lib/algorithm";
import { head, last, timeIntervalBarWidth, toObject } from "react-stockcharts/lib/utils";
import {
  Label,
  Annotate,
  SvgPathAnnotation,
  buyPath,
  sellPath,
} from "react-stockcharts/lib/annotation";
import { saveInteractiveNodes, getInteractiveNodes } from "../components/interactiveutils";


function round(number, precision = 0) {
  const d = Math.pow(10, precision);
  return Math.round(number * d) / d;
}

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: props.alert,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      alert: nextProps.alert,
    });
  }
  handleChange(e) {
    const { alert } = this.state;
    this.setState({
      alert: {
        ...alert,
        yValue: Number(e.target.value),
      }
    });
  }
  handleSave() {
    this.props.onSave(this.state.alert, this.props.chartId);
  }
  render() {
    const {
      showModal,
      onClose,
      onDeleteAlert,
    } = this.props;
    const { alert } = this.state;

    if (!showModal) return null;
    return (
      <Modal show={showModal} onHide={onClose} >
        <Modal.Header closeButton>
          <Modal.Title>Edit Alert</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <FormGroup controlId="text">
              <FormLabel>Alert when crossing</FormLabel>
              <FormControl type="number" value={alert.yValue} onChange={this.handleChange} />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={onDeleteAlert}>Delete Alert</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const macdAppearance = {
  stroke: {
    macd: "#FF0000",
    signal: "#00F300",
  },
  fill: {
    divergence: "#4682B4"
  },
};

const alert = InteractiveYCoordinate.defaultProps.defaultPriceCoordinate;
const resistance_ui = {
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: "#E3342F",
  textFill: "#E3342F",
  text: "Resistance(저항선)",
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: "#E3342F"
  }
};
const support_ui = {
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: "#1F9D55",
  textFill: "#1F9D55",
  text: "Support(지지선)",
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: "#1F9D55"
  }
};

class CodeChart extends Component {
    constructor(props){
      super(props)
      this.onKeyPress = this.onKeyPress.bind(this);
      this.onDragComplete = this.onDragComplete.bind(this);
      this.onDelete = this.onDelete.bind(this);
      this.handleChoosePosition = this.handleChoosePosition.bind(this);

      this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
      this.getInteractiveNodes = getInteractiveNodes.bind(this);

      this.handleSelection = this.handleSelection.bind(this);

      this.saveCanvasNode = this.saveCanvasNode.bind(this);

      this.handleDialogClose = this.handleDialogClose.bind(this);
      this.handleChangeAlert = this.handleChangeAlert.bind(this);
      this.handleDeleteAlert = this.handleDeleteAlert.bind(this);

      this.handleDoubleClickAlert = this.handleDoubleClickAlert.bind(this);

      this.setSRLineDraw = this.setSRLineDraw.bind(this);
      this.leftPad = this.leftPad.bind(this);
      this.toStringByFormatting = this.toStringByFormatting.bind(this);

      this.state = {
        enableInteractiveObject: false,
        yCoordinateList_Support: [],
        yCoordinateList_Resistance: [],
        yCoordinateList_1: [],
        yCoordinateList_3: [],
        showModal: false,
        alertToEdit: {},
        height: window.innerHeight,
      };
      this.handleReset = this.handleReset.bind(this);

    }
    saveCanvasNode(node) {
    this.canvasNode = node;
  }

  handleSelection(interactives, moreProps, e) {
    if (this.state.enableInteractiveObject) {
      const independentCharts = moreProps.currentCharts.filter(d => d !== 2);
      if (independentCharts.length > 0) {
        const first = head(independentCharts);

        const morePropsForChart = getMorePropsForChart(moreProps, first);
        const {
          mouseXY: [, mouseY],
          chartConfig: { yScale },
        } = morePropsForChart;

        const yValue = round(yScale.invert(mouseY), 2);
        const newAlert = {
          ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
          yValue,
          id: shortid.generate()
        };
        this.handleChoosePosition(newAlert, morePropsForChart, e);
      }
    } else {
      const state = toObject(interactives, each => {
        return [
          `yCoordinateList_${each.chartId}`,
          each.objects,
        ];
      });
      this.setState(state);
    }
  }
  handleChoosePosition(alert, moreProps) {
    const { id: chartId } = moreProps.chartConfig;
    this.setState({
      [`yCoordinateList_${chartId}`]: [
        ...this.state[`yCoordinateList_${chartId}`],
        alert
      ],
      enableInteractiveObject: false,
    });
  }

  leftPad(value) {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }

  toStringByFormatting(source, delimiter = '-') { 
    const year = source.getFullYear();
    const month = this.leftPad(source.getMonth() + 1);
    const day = this.leftPad(source.getDate());
    return [year, month, day].join(delimiter);
  }

  handleReset() {
    this.setState({
      suffix: this.state.suffix + 1
    });
  }

  handleDoubleClickAlert(item) {
    this.setState({
      showModal: true,
      alertToEdit: {
        alert: item.object,
        chartId: item.chartId,
      },
    });
  }
  handleChangeAlert(alert, chartId) {
    const yCoordinateList = this.state[`yCoordinateList_${chartId}`];
    const newAlertList = yCoordinateList.map(d => {
      return d.id === alert.id ? alert : d;
    });

    this.setState({
      [`yCoordinateList_${chartId}`]: newAlertList,
      showModal: false,
      enableInteractiveObject: false,
    });
  }
  handleDeleteAlert() {
    const { alertToEdit } = this.state;
    const key = `yCoordinateList_${alertToEdit.chartId}`;
    const yCoordinateList = this.state[key].filter(d => {
      return d.id !== alertToEdit.alert.id;
    });
    this.setState({
      showModal: false,
      alertToEdit: {},
      [key]: yCoordinateList
    });
  }
  handleDialogClose() {
    // cancel alert edit
    this.setState(state => {
      const { originalAlertList, alertToEdit } = state;
      const key = `yCoordinateList_${alertToEdit.chartId}`;
      const list = originalAlertList || state[key];

      return {
        showModal: false,
        [key]: list,
      };
    });
  }

  setSRLineDraw(){
    let obj_support = []
    let obj_resistance = []
    for(let i = 0; i < this.props.data.support.length; i++){
      obj_support.push({
        ...support_ui,
        yValue: this.props.data.support[i],
        id: shortid.generate(),
        draggable: false,
        })
    }
    for(let i = 0; i < this.props.data.resistance.length; i++){
      obj_resistance.push({
        ...resistance_ui,
        yValue: this.props.data.resistance[i],
        id: shortid.generate(),
        draggable: false,
        })
    }
      this.setState({
        yCoordinateList_Support : obj_support,
        yCoordinateList_Resistance : obj_resistance,
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.data.support !== this.props.data.support ){
      this.setSRLineDraw()
    }
  }

  componentDidMount() {
    document.addEventListener("keyup", this.onKeyPress);
    if(this.props.code !== "" ){
      this.setSRLineDraw()
    }
    this.setState({
      height: window.innerHeight
    });
  }
  componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyPress);
    this.setState({
      suffix: 1
    });
  }
  onDelete(yCoordinate, moreProps) {
    this.setState(state => {
      const chartId = moreProps.chartConfig.id;
      const key = `yCoordinateList_${chartId}`;

      const list = state[key];
      return {
        [key]: list.filter(d => d.id !== yCoordinate.id)
      };
    });
  }
  onDragComplete(yCoordinateList, moreProps, draggedAlert) {
    // this gets called on drag complete of drawing object
    const { id: chartId } = moreProps.chartConfig;

    const key = `yCoordinateList_${chartId}`;
    const alertDragged = draggedAlert != null;

    this.setState({
      enableInteractiveObject: false,
      [key]: yCoordinateList,
      showModal: alertDragged,
      alertToEdit: {
        alert: draggedAlert,
        chartId,
      },
      originalAlertList: this.state[key],
    });
  }
  onKeyPress(e) {
    const keyCode = e.which;
    switch (keyCode) {
      case 46: {
        // DEL
        this.setState({
          yCoordinateList_1: this.state.yCoordinateList_1.filter(d => !d.selected),
          yCoordinateList_3: this.state.yCoordinateList_3.filter(d => !d.selected)
        });
        break;
      }
      case 27: {
        // ESC
        this.node.terminate();
        this.canvasNode.cancelDrag();
        this.setState({
          enableInteractiveObject: false
        });
        break;
      }
      case 68: // D - Draw drawing object
      case 69: { // E - Enable drawing object
        this.setState({
          enableInteractiveObject: true
        });
        break;
      }
    }
  }

  render(){
    const annotationProps = {
      fontFamily: "Glyphicons Halflings",
      fontSize: 20,
      fill: "#060F8F",
      opacity: 0.8,
      text: "\ue182",
      y: ({ yScale }) => yScale.range()[0],
      onClick: console.log.bind(console),
      tooltip: d => timeFormat("%B")(d.date),
      // onMouseOver: console.log.bind(console),
    };

    const macdCalculator = macd()
    .options({
      fast: 12,
      slow: 26,
      signal: 9,
    })

    .merge((d, c) => {d.macd = c;})
    .accessor(d => d.macd);

    const ema5 = ema()
      .id(0)
      .options({ windowSize: 5 })
      .merge((d, c) => { d.ema5 = c; })
      .accessor(d => d.ema5);

    const ema20 = ema()
      .id(1)
      .options({ windowSize: 20 })
      .merge((d, c) => { d.ema20 = c; })
      .accessor(d => d.ema20);

    const ema120 = ema()
      .id(2)
      .options({ windowSize: 120 })
      .merge((d, c) => { d.ema120 = c; })
      .accessor(d => d.ema120);

    const smaVolume50 = sma()
      .id(3)
      .options({ windowSize: 50, sourcePath: "volume" })
      .merge((d, c) => { d.smaVolume50 = c; })
      .accessor(d => d.smaVolume50);

    const out_lier = algo()
      .windowSize(1)
      .accumulator(([now]) => {
        const { date : date } = now;
        for(var i = 0; i < this.props.data.increase_volume.length; i++){
          if( this.toStringByFormatting(date) == this.props.data.increase_volume[i]){
            return 1
          }
        }
        
      })
      .merge((d, c) => { d.out_lier = c; });

    const { type, width, ratio } = this.props;
    const { gridProps, seriesType } = this.props;
    const margin = { left: 50, right: 50, top: 20, bottom: 20 };

    const longAnnotationProps = {
      y: ({ yScale, datum }) => yScale(datum.low),
      fill: "#006517",
      path: buyPath,
      tooltip: "Go long",
    };

    const shortAnnotationProps = {
      y: ({ yScale, datum }) => yScale(datum.high),
      fill: "#FF0000",
      path: sellPath,
      tooltip: "Go short",
    };

    const { mouseMoveEvent, panEvent, zoomEvent, zoomAnchor } = this.props;

    const { chartdata : initialData } = this.props.data;
    const { showModal, alertToEdit } = this.state;

    const calculatedData = macdCalculator(smaVolume50(ema120(ema20(ema5(out_lier(initialData))))));

    const xScaleProvider = discontinuousTimeScaleProvider
    .inputDateAccessor(d => d.date);

    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(calculatedData);

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [start, end];

    const Series = seriesType === "line"
      ? LineSeries
      : AreaSeries;

    return (
      <div>
        { this.props.data.chartdata.length > 0 ? (
        <ChartCanvas ref={this.saveCanvasNode}
          height={900}
          ratio={ratio}
          mouseMoveEvent={mouseMoveEvent}
          width={width}
          margin={{ left: 50, right: 50, top: 10, bottom: 20 }}
          type={type}
          panEvent={panEvent}
          zoomEvent={zoomEvent}
          zoomAnchor={zoomAnchor}
          seriesName="Chart"
          data={data}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xScale={scaleTime()}
          xExtents={xExtents}>

        <Chart id={1} height={550}
          yExtents={[d => [d.high, d.low], ema5.accessor(), ema20.accessor(), ema120.accessor()]}
          padding={{ top: 10, bottom: 20 }}
        >
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} />
          <YAxis axisAt="right" orient="right" ticks={5} />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format("1d")} />

          <CandlestickSeries />
          <LineSeries yAccessor={ema5.accessor()} stroke={ema5.stroke()}/>
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
          <LineSeries yAccessor={ema120.accessor()} stroke={ema120.stroke()}/>

          <CurrentCoordinate yAccessor={ema5.accessor()} fill={ema5.stroke()} />
          <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
          <CurrentCoordinate yAccessor={ema120.accessor()} fill={ema120.stroke()} />

          <OHLCTooltip origin={[-40, 0]}/>

          <InteractiveYCoordinate
            ref={this.saveInteractiveNodes("InteractiveYCoordinate", 1)}
            enabled={this.state.enableInteractiveObject}
            onDragComplete={this.onDragComplete}
            onDelete={this.onDelete}
            yCoordinateList={this.state.yCoordinateList_Support}
          />

          <InteractiveYCoordinate
            ref={this.saveInteractiveNodes("InteractiveYCoordinate", 1)}
            enabled={this.state.enableInteractiveObject}
            onDragComplete={this.onDragComplete}
            onDelete={this.onDelete}
            yCoordinateList={this.state.yCoordinateList_Resistance}
          />

          <MovingAverageTooltip
            onClick={e => console.log(e)}
            origin={[-38, 15]}
            options={[
              {
                yAccessor: ema5.accessor(),
                type: "EMA",
                stroke: ema5.stroke(),
                windowSize: ema5.options().windowSize,
              },
              {
                yAccessor: ema20.accessor(),
                type: "EMA",
                stroke: ema20.stroke(),
                windowSize: ema20.options().windowSize,
              },
              {
                yAccessor: ema120.accessor(),
                type: "EMA",
                stroke: ema120.stroke(),
                windowSize: ema120.options().windowSize,
              }
            ]}
          />

          <Annotate with={SvgPathAnnotation} when={d => d.out_lier === 1}
            usingProps={longAnnotationProps} />
            
        </Chart>
        <Chart id={2}
          yExtents={[d => d.volume]}
          height={100} origin={(w, h) => [0, h - 310]}
          >
          <XAxis axisAt="bottom" orient="bottom"/>
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")} />

          <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
          <AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>

          <CurrentCoordinate yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
          <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

        </Chart>
        <Chart id={3}
          yExtents={macdCalculator.accessor()}
          height={100}
          origin={(w, h) => [0, h - 180]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis axisAt="bottom" orient="bottom"/>
          <YAxis axisAt="right" orient="right" ticks={2} />

          <MouseCoordinateXV2
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")} />

          <MACDSeries yAccessor={d => d.macd}
            {...macdAppearance} />

          <MACDTooltip
            origin={[-38, 15]}
            yAccessor={d => d.macd}
            options={macdCalculator.options()}
            appearance={macdAppearance}
          />
        </Chart>
        <CrossHairCursor />
        <DrawingObjectSelector
          enabled
          getInteractiveNodes={this.getInteractiveNodes}
          drawingObjectMap={{
            InteractiveYCoordinate: "yCoordinateList"
          }}
          onSelect={this.handleSelection}
          onDoubleClick={this.handleDoubleClickAlert}
        />
      </ChartCanvas>
      
      ) : (null)
    }
    </div>

    );
  }
}

CodeChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg"]).isRequired,
};

CodeChart.defaultProps = {
  type: "svg",
  mouseMoveEvent: true,
  panEvent: true,
  zoomEvent: true,
};
CodeChart = fitWidth(CodeChart);

export default CodeChart