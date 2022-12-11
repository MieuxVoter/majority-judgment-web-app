import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GradeResultInterface, MeritProfileInterface } from '@services/type';
import { getMajorityGrade } from '@services/majorityJudgment';

interface ParamsInterface {
  numVotes: number;
  outgaugeThreshold: number;
}

interface GradeBarInterface {
  grade: GradeResultInterface;
  size: number;
  index: number;
  params: ParamsInterface;
}

const GradeBar = ({ index, grade, size, params }: GradeBarInterface) => {
  const width = `${size * 100}%`;
  const textWidth = Math.floor(100 * size);

  const left = `${(size * 100) / 2}%`;
  const top = index % 2 ? '20px' : '-20px';

  if (size < 0.001) {
    return null;
  }

  return (
    <div
      className="h-100"
      style={{
        flexBasis: width,
        backgroundColor: grade.color,
        minHeight: '20px',
      }}
    >
      {/* size < params.outgaugeThreshold ? (
          <span
            style={{
              left: left,
              top: top,
              display: "relative",
              backgroundColor: grade.color,
            }}
          >
            {textWidth}%
          </span>
        ) : (
          <span>
            {Math.floor(100 * size)}%
          </span>
        )
*/}
    </div>
  );
};

const DashedMedian = () => {
  return (
    <div
      className="position-relative d-flex justify-content-center"
      style={{ top: '60px', height: '50px' }}
    >
      <div className="border h-100 border-1 border-dark border-opacity-75 border-dashed"></div>
    </div>
  );
};

const MajorityGrade = ({ grade, left }) => {
  const spanRef = useRef<HTMLDivElement>();

  const [width, setWidth] = useState(40);

  useLayoutEffect(() => {
    if (spanRef && spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [spanRef.current]);

  useEffect(() => {
    if (spanRef && spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [spanRef.current]);

  return (
    <>
      <span
        ref={spanRef}
        style={{
          color: 'white',
          backgroundColor: grade.color,
          left: `calc(${left * 100}% - ${width / 2}px)`,
          top: '-20px',
        }}
        className="p-2 position-relative fw-bold rounded-1 text-center"
      >
        {grade.name}
      </span>
      <span
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          left: `calc(${left * 100}% - ${width + 6}px)`,
          top: '20px',
          borderLeftWidth: 6,
          borderRightWidth: 6,
          borderTopWidth: 12,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: grade.color,
          color: 'transparent',
        }}
      ></span>
    </>
  );
};

interface MeritProfileBarInterface {
  profile: MeritProfileInterface;
  grades: Array<GradeResultInterface>;
}

const MeritProfileBar = ({ profile, grades }: MeritProfileBarInterface) => {
  const gradesByValue: { [key: number]: GradeResultInterface } = {};
  grades.forEach((g) => (gradesByValue[g.value] = g));

  const numVotes = Object.values(profile).reduce((a, b) => a + b, 0);
  const values = grades.map((g) => g.value).sort();
  const normalized = values.map((value) =>
    value in profile ? profile[value] / numVotes : 0
  );
  // low values means great grade

  // find the majority grade
  const majorityIdx = getMajorityGrade(normalized);
  const majorityGrade = grades[majorityIdx];

  const proponentSizes = normalized.filter(
    (_, i) => values[i] < majorityGrade.value
  );
  const proponentWidth = proponentSizes.reduce((a, b) => a + b, 0);

  const opponentSizes = normalized.filter(
    (_, i) => values[i] > majorityGrade.value
  );
  const opponentWidth = opponentSizes.reduce((a, b) => a + b, 0);

  // is proponent higher than opposant?
  const proponentMajority = proponentWidth > opponentWidth;

  // for mobile phone, we outgauge earlier than on desktop
  const innerWidth =
    typeof window !== 'undefined' && window.innerWidth
      ? window.innerWidth
      : 1000;

  const params: ParamsInterface = {
    outgaugeThreshold: innerWidth <= 760 ? 0.05 : 0.03,
    numVotes,
  };

  return (
    <>
      <DashedMedian />
      <MajorityGrade
        grade={majorityGrade}
        left={proponentWidth + normalized[majorityIdx] / 2}
      />
      <div className="d-flex">
        <div
          className={`d-flex border border-${
            proponentMajority ? 2 : 1
          } border-success`}
          style={{ flexBasis: `${proponentWidth * 100}%` }}
        >
          {values
            .filter((v) => v < majorityGrade.value)
            .map((v) => {
              const index = values.indexOf(v);
              const size =
                proponentWidth < 1e-3 ? 0 : normalized[index] / proponentWidth;
              return (
                <GradeBar
                  index={index}
                  params={params}
                  grade={grades[v]}
                  key={index}
                  size={size}
                />
              );
            })}
        </div>
        <div
          className="border border-2 border-primary"
          style={{ flexBasis: `${normalized[majorityIdx] * 100}%` }}
        >
          {values
            .filter((v) => v === majorityGrade.value)
            .map((v) => {
              const index = values.indexOf(v);
              return (
                <GradeBar
                  index={index}
                  params={params}
                  grade={grades[v]}
                  key={index}
                  size={1}
                />
              );
            })}
        </div>
        <div
          className={`d-flex border border-${
            proponentMajority ? 1 : 2
          } border-danger`}
          style={{ flexBasis: `${opponentWidth * 100}%` }}
        >
          {values
            .filter((v) => v > majorityGrade.value)
            .map((v) => {
              const index = values.indexOf(v);
              const size =
                opponentWidth < 1e-3 ? 0 : normalized[index] / opponentWidth;
              return (
                <GradeBar
                  index={index}
                  params={params}
                  grade={grades[v]}
                  key={index}
                  size={size}
                />
              );
            })}
        </div>
      </div>
      {/* <div className='median dash'> </div> */}
    </>
  );
};
export default MeritProfileBar;
