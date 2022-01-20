import * as React from "react";
import { useState } from "react";
import dynamic from 'next/dynamic';
import HeaderResult from '../../../components/layouts/result/HeaderResult'
import {
  Container,
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";

const DynamicPlot = dynamic(import('../../../components/plot'), {
  ssr: false
})

//import ChartWrapper from "../../../components/ChartWrapper";
import SystemeVote from '../../../components/SystemeVote';
import LoadingScreen from '../../../components/LoadingScreen'
export default function Result() {
  const [collapseGraphics, setCollapseGraphics] = useState(false);
//   const [loading, setLoading] = React.useState(true);
//   React.useEffect(() =>{
//     setTimeout(() => setLoading(false), 3000);
// })
  return (
    <div>
      <HeaderResult />
      <section className="resultPage">
      <h4>Détails des résultats</h4>
      <Card className="resultCard">
        <CardHeader className="pointer" onClick={() => setCollapseGraphics(!collapseGraphics)}>
          <h4 className={"m-0 panel-title " + (collapseGraphics ? "collapsed" : "")}>
            Taubira
        </h4>
        </CardHeader>
        <Collapse isOpen={collapseGraphics}>
          <CardBody className="pt-5">
             
            <SystemeVote />
           
          </CardBody>
        </Collapse>
      </Card>
    </section>
    </div>
  )
}
