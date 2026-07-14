import { response } from 'express';
import type { PollResult } from '../../polling'




type Props = {
  data: PollResult;
};

function Dash({ data }: Props) {
  return (
    <div className="header">
      <h1>Dashboard</h1>
      <AverageSpeed data={data} />
    </div>
  );
}
function AverageSpeed({ data }: Props){

  if (!data){
    return <h1>No current data.</h1>
  }
  const AverageResponseTime = data.responseTime
  return (
    <h1>{AverageResponseTime}</h1>
  );
}

export default Dash;

