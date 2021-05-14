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
      candidates.push({label: "", fieldRef: createRef()});
      setCandidates([...candidates]);
      onChange(candidates)
    } else {
      console.error("Too many candidates")
    }
  };

  useEffect(() => {
    addCandidate();
    addCandidate();
  }, [])


  const removeCandidate = index => {
    if (candidates.length === 1) {
      const newCandidates = []
      newCandidates.push({label: "", fieldRef: createRef()});
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
    <>
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
              onDelete={() => removeCandidate(index)}
              onChange={(e) => editCandidate(index, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              innerRef={candidate.fieldRef}
            />
          )
        })}
      </SortableContainer>

      <Button
        color="secondary"
        className="btn-block mt-2"
        tabIndex={candidates.length + 2}
        type="button"
        onClick={addCandidate}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        {t("Add a proposal")}
      </Button>
    </>
  );

}


export default CandidatesField

