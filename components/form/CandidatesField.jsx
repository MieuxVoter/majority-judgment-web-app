import {useState, useEffect, createRef} from 'react'
import {useTranslation} from "react-i18next";
// import {DndContext, useDroppable} from '@dnd-kit/core';
import CandidateField from './CandidateField'
import Alert from '@components/Alert'
import {MAX_NUM_CANDIDATES} from '@services/constants';


// export function CandidateList(props) {
//   const {isOver, setNodeRef} = useDroppable({
//     id: props.id,
//   });
//   const style = {
//     opacity: isOver ? 1 : 0.5,
//   };
// 
//   return (
//     <div ref={setNodeRef} style={style}>
//       {props.children}
//     </div>
//   );
// }


// const SortableItem = sortableElement(({className, ...childProps}) => <li className={className}><CandidateField {...childProps} /></li>);
// 
// const SortableContainer = sortableContainer(({children}) => {
//   return <ul className="sortable">{children}</ul>;
// });


// const arrayMove = (arr, fromIndex, toIndex) => {
//   // https://stackoverflow.com/a/6470794/4986615
//   const element = arr[fromIndex];
//   arr.splice(fromIndex, 1);
//   arr.splice(toIndex, 0, element);
//   return arr
// }


const CandidatesField = ({onChange}) => {
  const {t} = useTranslation();
  const createCandidate = () => ({label: "", description: "", fieldRef: createRef()})

  // Initialize the list with at least two candidates
  const [candidates, setCandidates] = useState([createCandidate(), createCandidate()])
  const [error, setError] = useState(null)

  const addCandidate = () => {
    if (candidates.length < MAX_NUM_CANDIDATES) {
      setCandidates(
        c => {
          c.push(createCandidate());
          return c
        }
      );
    } else {
      setError('error.too-many-candidates')
    }
  };


  // What to do when we change the candidates
  useEffect(() => {
    onChange();
  }, [candidates])


  const removeCandidate = index => {
    if (candidates.length === 1) {
      setCandidates([createCandidate()]);
    }
    else {
      setCandidates(oldCandidates =>
        oldCandidates.filter((_, i) => i != index)
      );
    }
  };

  const editCandidate = (index, label) => {
    setCandidates(
      oldCandidates => {
        oldCandidates[index].label = label;
        return oldCandidates;
      }
    )
  };

  const handleKeyPress = (e, index) => {
    if (e.key !== "Enter") {
      e.preventDefault();
      if (index + 1 === candidates.length) {
        addCandidate();
      }
      candidates[index + 1].fieldRef.current.focus();
    }

  }

  const onSortEnd = ({oldIndex, newIndex}) => {
    setCandidates(c => arrayMove(c, oldIndex, newIndex));
  };


  return (
    <div className="sectionAjouterCandidat">
      <div className="ajouterCandidat">
        <h4>Saisissez ici le nom de vos candidats.</h4>
        <Alert msg={error} />
        {candidates.map((candidate, index) => {
          const className = "sortable"
          return (
            <CandidateField
              className={className}
              key={`item-${index}`}
              index={index}
              candIndex={index}
              label={candidate.label}
              description={candidate.description}
              onDelete={() => removeCandidate(index)}
              onChange={(e) => editCandidate(index, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onAdd={addCandidate}
              innerRef={candidate.fieldRef}
            />
          )
        })}
      </div>
    </div >
  );

}


export default CandidatesField

