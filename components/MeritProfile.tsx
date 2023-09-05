import { useEffect, useRef, useState } from 'react';
import { GradeResultInterface, MeritProfileInterface } from '@services/type';
import { getMajorityGrade } from '@services/majorityJudgment';

interface GradeBarInterface {
  grade: GradeResultInterface;
  size: number;
}

const GradeBar = ({ grade, size }: GradeBarInterface) => {
  const width = `${size * 100}%`;

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
    ></div>
  );
};

const DashedMedian = () => {
  return (
    <div
      className="d-flex justify-content-center"
      style={{ marginTop: '-40px', height: '50px' }}
    >
      <div className="border h-100 border-1 border-dark border-opacity-75 border-dashed position-relative"></div>
    </div>
  );
};

const MajorityGrade = ({ grade, left }) => {
  // const spanRef = useRef<HTMLDivElement>();
  const spanRef = useRef<HTMLDivElement>();

  const [width, setWidth] = useState(0);
  const offsetWidth = spanRef && spanRef.current && spanRef.current.offsetWidth;

  useEffect(() => {
    setTimeout(() => {
      setWidth(spanRef.current.offsetWidth);
    }, 100);
  }, [offsetWidth]);

  return (
    <div
      style={{ left: `calc(${left * 100}% - ${width / 2}px)` }}
      className="position-relative"
    >
      <div
        ref={spanRef}
        style={{
          color: 'white',
          backgroundColor: grade.color,
          width: 'fit-content',
        }}
        className="p-2  fw-bold rounded-1 text-center"
      >
        {grade.name}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          position: 'relative',
          left: `${width / 2 - 6}px`,
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
      ></div>
    </div>
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
  const normalized = {};
  values.forEach((v) => (normalized[v] = profile[v] / numVotes || 0));
  // low values means great grade

  // find the majority grade
  const majorityValue = getMajorityGrade(normalized);
  const majorityGrade = gradesByValue[majorityValue];

  const proponentSizes = values
    .filter((v) => v > majorityGrade.value)
    .map((v) => normalized[v]);
  const proponentWidth = proponentSizes.reduce((a, b) => a + b, 0);

  const opponentSizes = values
    .filter((v) => v < majorityGrade.value)
    .map((v) => normalized[v]);
  const opponentWidth = opponentSizes.reduce((a, b) => a + b, 0);

  // is proponent higher than opposant?
  const proponentMajority = proponentWidth > opponentWidth;

  return (
    <>
      <MajorityGrade
        grade={majorityGrade}
        left={proponentWidth + normalized[majorityValue] / 2}
      />
      <div className="d-flex">
        {proponentWidth > 1e-5 ? (
          <div
            className={`d-flex border border-${
              proponentMajority ? 2 : 1
            } border-success`}
            style={{ flexBasis: `${proponentWidth * 100}%` }}
          >
            {values
              .filter((v) => v > majorityGrade.value)
              .reverse()
              .map((v, i) => {
                const size =
                  proponentWidth < 1e-3 ? 0 : normalized[v] / proponentWidth;
                return (
                  <GradeBar grade={gradesByValue[v]} key={i} size={size} />
                );
              })}
          </div>
        ) : (
          <div
            className="d-flex"
            style={{ flexBasis: `${proponentWidth * 100}%` }}
          ></div>
        )}
        <div
          className="border border-2 border-primary"
          style={{ flexBasis: `${normalized[majorityValue] * 100}%` }}
        >
          {values
            .filter((v) => v === majorityGrade.value)
            .map((v, i) => {
              return <GradeBar grade={gradesByValue[v]} key={i} size={1} />;
            })}
        </div>
        {opponentWidth > 1e-5 ? (
          <div
            className={`d-flex border border-${
              proponentMajority ? 1 : 2
            } border-danger`}
            style={{ flexBasis: `${opponentWidth * 100}%` }}
          >
            {values
              .filter((v) => v < majorityGrade.value)
              .reverse()
              .map((v, i) => {
                const size =
                  opponentWidth < 1e-3 ? 0 : normalized[v] / opponentWidth;
                return (
                  <GradeBar grade={gradesByValue[v]} key={i} size={size} />
                );
              })}
          </div>
        ) : (
          <div
            className="d-flex"
            style={{ flexBasis: `${opponentWidth * 100}%` }}
          ></div>
        )}
      </div>
      {/* <div className='median dash'> </div> */}
      <DashedMedian />
    </>
  );
};
export default MeritProfileBar;
