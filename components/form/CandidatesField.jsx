import {useState, useEffect, createRef} from 'react'
import {useTranslation} from "react-i18next";
import {
  Button,
  Card,
  CardBody
} from "reactstrap";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move"
import CandidateField from './CandidateField'
import AlertDismissibleExample from './AlertButton'
// const SortableItem = sortableElement(({className, ...childProps}) => <li className={className}><CandidateField {...childProps} /></li>);
// 
// const SortableContainer = sortableContainer(({children}) => {
//   return <ul className="sortable">{children}</ul>;
// });

const SortableItem = ({className, ...childProps}) => <li className={className}><CandidateField {...childProps} /></li>;

const SortableContainer = ({children}) => {
  return <ul className="sortable">{children}</ul>;
};


const CandidatesField = ({onChange}) => {
  const {t} = useTranslation();
  const [candidates, setCandidates] = useState([])

  const addCandidate = () => {
    if (candidates.length < 1000) {
      candidates.push({label: "", description: "", fieldRef: createRef()});
      setCandidates([...candidates]);
      onChange(candidates)
    } else {
      console.error("Too many candidates")
    }
  };

  useEffect(() => {
    addCandidate();

  }, [])


  const removeCandidate = index => {
    if (candidates.length === 1) {
      const newCandidates = []
      newCandidates.push({label: "", fieldRef: createRef()});
      setCandidates(newCandidates);
      onChange(newCandidates)
    }
    else {
      const newCandidates = candidates.filter((c, i) => i != index)
      setCandidates(newCandidates);
      onChange(newCandidates);
    }
  };

  const editCandidate = (index, label) => {
    candidates[index].label = label
    setCandidates([...candidates]);
    onChange(candidates);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index + 1 === candidates.length) {
        addCandidate();
      }
      else { 
        candidates[index + 1].fieldRef.current.focus();
      }
    }
    
  }

  const onSortEnd = ({oldIndex, newIndex}) => {
    setCandidates(arrayMove(candidates, oldIndex, newIndex));
  };

  return (
    <div className="sectionAjouterCandidat">
      <div className="ajouterCandidat">
        <h4>Saisissez ici le nom de vos candidats.</h4>
        <AlertDismissibleExample />
      <SortableContainer onSortEnd={onSortEnd}>
        {candidates.map((candidate, index) => {
          const className = "sortable"
          return (
            <SortableItem
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
      </SortableContainer>
      </div>
    </div>
  );

}


export default CandidatesField

