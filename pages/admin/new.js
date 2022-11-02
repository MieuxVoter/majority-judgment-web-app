import {useReducer, useState, useEffect} from "react";
import Head from "next/head";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import CandidatesField from "@components/admin/CandidatesField";
import ParamsField from "@components/admin/ParamsField";
import ConfirmModal from "@components/admin/ConfirmModal";
import {ElectionProvider, useElection} from '@components/admin/ElectionContext';
import {ProgressSteps, creationSteps} from "@components/CreationSteps";
// import DatePicker from "react-datepicker";
// 



export const getStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});


/** 
 * Manage the steps for creating an election
 */
const CreateElectionForm = (props) => {
  const {t} = useTranslation();

  // load the election
  const election = useElection();

  const handleSubmit = () => {
    if (stepId < 2) {
      setStepId(i => i + 1);
    }
    else { // TODO
    }
  }

  // at which creation step are we?
  const [stepId, setStepId] = useState(0);
  const step = creationSteps[stepId];

  let Step;
  if (step == 'candidate') {
    Step = <CandidatesField onSubmit={handleSubmit} />
  } else if (step == 'params') {
    Step = <ParamsField onSubmit={handleSubmit} />;
  } else if (step == 'confirm') {
    Step = <>
      <ParamsField />
      <ConfirmModal onSubmit={handleSubmit} />
    </>;
  } else {
    throw Error(`Unknown step ${step}`);
  }


  return (
    <ElectionProvider>
      <ProgressSteps step={step} />
      {Step}

    </ElectionProvider>

  );
}
//         <Container className="addCandidatePage">
//           { //<ToastContainer />
//           }
//           {waiting ? <Loader /> : ""}
//           <form className="form" onSubmit={handleSubmit} autoComplete="off">
//             <div className={displayNone}>
//               <Row className="stepForm">
//                 <Col className="stepFormCol">
//                   <img src="/icone-one-white.svg" />
//                   <h4>Les candidats</h4>
//                 </Col>
//                 <Col className="stepFormCol opacity">
//                   <img src="/icone-two-dark.svg" />
//                   <h4>Paramètres du vote</h4>
//                 </Col>
//                 <Col className="stepFormCol opacity">
//                   <img src="/icone-three-dark.svg" />
//                   <h4>Confirmation</h4>
// 
//                 </Col>
//               </Row>
// 
//               <Row>
//                 <Col xs="12">
//                   <CandidatesField onChange={setCandidates} />
//                 </Col>
//               </Row>
// 
//               <Row className="justify-content-center">
//                 <div className="mx-auto mt-5">
// 
//                   <Button onClick={handleFirstSubmit} className="cursorPointer btn-opacity btn-validation mb-5" >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
//                 </div>
//               </Row>
//             </div>
// 
// 
// 
// 
//             <div className={displayBlock}>
//               <div onClick={changeDisplay} className="btn-return-candidates"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Retour aux candidats</div>
//               <Row className="stepForm">
//                 <Col className="stepFormCol">
//                   <img src="/icone-check-dark.svg" />
//                   <h4>Les candidats</h4>
//                 </Col>
//                 <Col className="stepFormCol">
//                   <img src="/icone-two-white.svg" />
//                   <h4>Paramètres du vote</h4>
//                 </Col>
//                 <Col className="stepFormCol opacity">
//                   <img src="/icone-three-dark.svg" />
//                   <h4>Confirmation</h4>
// 
//                 </Col>
//               </Row>
//               <div className="settings-modal-body ">
//                 <div className="mobile-title">{t("Vos paramètres")}</div>
//                 <Row>
//                   <Col>
//                     <Row className="row-label">
//                       <Col xs="10" lg="10">
//                         <Label htmlFor="title">{t("Access to results")} {t("Immediately")}</Label>
// 
//                       </Col>
//                       <Col l xs="2" lg="2">
//                         <div className="radio-group">
//                           <input
//                             className="radio"
//                             type="radio"
//                             name="restrict_result"
//                             id="restrict_result_false"
//                             onClick={handleRestrictResultCheck}
//                             defaultChecked={!restrictResult}
//                             value="0"
//                           />
//                           <label htmlFor="restrict_result_false" />
//                           <input
//                             className="radio"
//                             type="radio"
//                             name="restrict_result"
//                             id="restrict_result_true"
//                             onClick={handleRestrictResultCheck}
//                             defaultChecked={!restrictResult}
//                             value="1"
//                           />
//                           <label htmlFor="restrict_result_true" />
//                           <div className="radio-switch"></div>
//                         </div>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col xs="12" md="10">
//                         <p>{t("No one will be able to see the result until the end date is reached or until all participants have voted.")}</p>
//                       </Col>
//                     </Row>
//                   </Col>
//                 </Row>
//                 <hr className="settings-divider" />
//                 <div className="row-label" id="voting-time-label">
//                   <Row>
// 
//                     <Col xs="10">
//                       <Label htmlFor="title">{t("Voting time")}</Label>
//                     </Col>
//                     <Col l xs="2">
//                       <div className="radio-group">
//                         <input
//                           className="radio"
//                           type="radio"
//                           name="time_limited"
//                           id="is_time_limited_false"
//                           onClick={handleIsTimeLimited}
//                           defaultChecked={isTimeLimited}
//                           value="0"
//                         /><label htmlFor="is_time_limited_false" />
//                         <input
//                           className="radio"
//                           type="radio"
//                           name="time_limited"
//                           id="is_time_limited_true"
//                           onClick={handleIsTimeLimited}
//                           defaultChecked={isTimeLimited}
//                           value="1"
//                         />
//                         <label htmlFor="is_time_limited_true" />
//                         <div className="radio-switch"></div>
//                       </div>
//                     </Col>
// 
//                   </Row>
//                   <div
//                     className={
//                       (isTimeLimited ? "d-block " : "d-none")
//                     }
//                   >
//                     { // <DatePicker selected={startDate} onChange= {(date) => setStartDate(date)} />
//                     }
//                     {/* <Row className="displayNone">
//                   <Col xs="12" md="3" lg="3">
//                     <span className="label">- {t("Starting date")}</span>
//                   </Col>
//                   <Col xs="6" md="4" lg="3">
//                     
//                     <input
//                       className="form-control"
//                       type="date"
//                       value={dateToISO(start)}
//                       onChange={(e) => {
//                         setStart(
//                           new Date(
//                             timeMinusDate(start) +
//                             new Date(e.target.valueAsNumber).getTime()
//                           )
//                         );
//                       }}
//                     />
//                   </Col>
//                   <Col xs="6" md="5" lg="3">
//                     <select
//                       className="form-control"
//                       value={getOnlyValidDate(start).getHours()}
//                       onChange={(e) =>
//                         setStart(
//                           new Date(
//                             dateMinusTime(start).getTime() +
//                             e.target.value * 3600000
//                           )
//                         )
//                       }
//                     >
//                       {displayClockOptions()}
//                     </select>
//                   </Col>
//                 </Row>
// 
//                 <Row className="mt-2">
// 
//                   <Col xs="6" md="4" lg="3" className="time-container">
//                     <input
//                       className="form-control"
//                       type="date"
//                       value={dateToISO(finish)}
//                       min={dateToISO(start)}
//                       onChange={(e) => {
//                         setFinish(
//                           new Date(
//                             timeMinusDate(finish) +
//                             new Date(e.target.valueAsNumber).getTime()
//                           )
//                         );
//                       }}
//                     />
//                   </Col>
//                   <Col xs="6" md="5" lg="3" className="displayNone">
//                     <select
//                       className="form-control"
//                       value={getOnlyValidDate(finish).getHours()}
//                       onChange={(e) =>
//                         setFinish(
//                           new Date(
//                             dateMinusTime(finish).getTime() +
//                             e.target.value * 3600000
//                           )
//                         )
//                       }
//                     >
//                       {displayClockOptions()}
//                     </select>
//                   </Col>
//                 </Row> */}
//                   </div></div>
//                 <hr className="settings-divider" />
//                 <Row className="componentMobile">
//                   <Col>
//                     <Row className="row-label">
//                       <Label>{t("Grades")}</Label>
//                       <FontAwesomeIcon onClick={toggleGrades} icon={faChevronRight} className="ml-2 my-auto" />
// 
//                     </Row>
//                     <Row className="mx-0">
//                       <p className="m-0">{t("You can select here the number of grades for your election")}</p>
//                     </Row>
//                   </Col>
//                 </Row>
// 
//                 <Modal
//                   isOpen={visibledGrades}
//                   toggle={toggleGrades}
//                   className="modal-dialog-centered grades-mobile"
//                 ><ModalHeader toggle={toggleGrades}>
//                     <Label>{t("Grades")}</Label>
//                   </ModalHeader>
//                   <ModalBody>
//                     <p>{t("Choisissez le nombre de mentions des votes.")}</p>
//                     <div className="numGradesContainer justify-content-center" tabIndex={candidates.length + 3}>
// 
//                       {badgesValues.map(f => (
// 
//                         <Label className="numGrades numGradesMobile">
//                           <Input type="radio" name="radio" value={f} checked={badgesValue === f}
//                             onChange={e => setNumGrades(e.currentTarget.value)} />
//                           <div className="customCheckmarck customCheckmarckMobile"><p>{f}</p></div>
//                         </Label>
//                       ))}
//                     </div>
//                     <p className="mt-2">{t("Voici la liste des mentions de votre vote")}</p>
//                     {grades.map((mention, i) => {
//                       return (
//                         <span
//                           key={i}
//                           className={"badge badge-light mx-1 my-2 " + mention.class}
//                           style={{
//                             backgroundColor: mention.color,
//                             color: "#fff",
//                             opacity: i < numGrades ? 1 : 0.3,
//                           }}
//                         >
//                           {mention.label}
//                         </span>
//                       );
//                     })}
//                     <Row>
//                       <Button
//                         type="button"
//                         className="btn-confirm-mobile"
//                         onClick={toggleGrades}>
//                         <FontAwesomeIcon className="mr-2" icon={faCheck} />
//                         {t("Valider les mentions")}
//                       </Button>
//                     </Row>
// 
//                   </ModalBody>
//                 </Modal>
// 
// 
//                 <Row className="componentDesktop">
//                   <Col xs="9">
//                     <Label>{t("Grades")}</Label>
//                     <p>{t("You can select here the number of grades for your election")}</p>
//                   </Col>
//                   <Col xs="3">
//                     <div className="numGradesContainer justify-content-end" tabIndex={candidates.length + 3}>
//                       {badgesValues.map(f => (
// 
//                         <Label className="numGrades ">
//                           <Input type="radio" name="radio" value={f} checked={badgesValue === f}
//                             onChange={e => setNumGrades(e.currentTarget.value)} />
//                           <div className="customCheckmarck"><p>{f}</p></div>
//                         </Label>
//                       ))}
// 
//                     </div>
//                   </Col>
//                   <Col
//                     xs="12"
//                     md="9"
//                     lg="9"
//                   >
//                     {grades.map((mention, i) => {
//                       return (
//                         <span
//                           key={i}
//                           className={"badge badge-light mr-2 mt-2 " + mention.class}
//                           style={{
//                             backgroundColor: mention.color,
//                             color: "#fff",
//                             opacity: i < numGrades ? 1 : 0.3,
//                           }}
//                         >
//                           {mention.label}
//                         </span>
//                       );
//                     })}
//                   </Col>
//                 </Row>
//                 <hr className="settings-divider" />
//                 <Row>
//                   <Col>
//                     <Row className="row-label">
//                       <Col xs="10" lg="10">
//                         <Label htmlFor="title">{t("Vote privée")}</Label>
// 
//                       </Col>
//                       <Col l xs="2" lg="2">
//                         <div className="radio-group">
//                           <input
//                             className="radio"
//                             type="radio"
//                             name="restrict_result"
//                             id="restrict_result_false"
//                             onClick={handleRestrictResultCheck}
//                             defaultChecked={!restrictResult}
//                             value="0"
//                           />
//                           <label htmlFor="restrict_result_false" />
//                           <input
//                             className="radio"
//                             type="radio"
//                             name="restrict_result"
//                             id="restrict_result_true"
//                             onClick={handleRestrictResultCheck}
//                             defaultChecked={!restrictResult}
//                             value="1"
//                           />
//                           <label htmlFor="restrict_result_true" />
//                           <div className="radio-switch"></div>
//                         </div>
//                       </Col>
//                     </Row>
// 
//                     <Row className="mx-0"><p className="mx-0">{t("Uniquement les personnes invités par mail pourront participé au vote")}</p></Row>
//                   </Col></Row>
//                 <hr className="settings-divider" />
//                 <Row className="componentMobile">
//                   <Col xs="12">
//                     <Row className="row-label">
//                       <Label>{t("Participants")}</Label>
//                       <FontAwesomeIcon onClick={toggleMails} icon={faChevronRight} className="ml-2 my-auto" />
//                     </Row>
//                     <p>{t("Copier-coller les emails des participants depuis un fichier Excel")}</p>
//                     <Modal
//                       isOpen={visibledMails}
//                       toggle={toggleMails}
//                       className="modal-dialog-centered grades-mobile"
//                     >
//                       <ModalHeader toggle={toggleMails}>
//                         <Label>{t("Ajouter des invités")}</Label>
//                       </ModalHeader>
//                       <ModalBody>
//                         <Row>
//                           <p className="mr-2 my-auto">{t("À ")}</p>
// 
//                           { /* <ReactMultiEmail
//                         placeholder={t("Add here participants' emails")}
//                         emails={emails}
//                         onChange={setEmails}
//                         validateEmail={(email) => {
//                           return isEmail(email); // return boolean
//                         }}
//                         getLabel={(email, index, removeEmail) => {
//                           return (
//                             <div data-tag key={index}>
//                               {email}
//                               <span
//                                 data-tag-handle
//                                 onClick={() => removeEmail(index)}
//                               >
//                                 ×
//                               </span>
// 
//                             </div>
// 
//                           );
//                         }}
// 
//                       />
//                       */}
//                         </Row>
//                         <Row>
//                           <Button
//                             type="button"
//                             className="btn-confirm-mobile"
//                             onClick={toggleMails}>
//                             <FontAwesomeIcon className="mr-2" icon={faCheck} />
//                             {t("Valider les mails")}
//                           </Button>
//                         </Row>
//                       </ModalBody>
//                     </Modal>
// 
// 
// 
//                   </Col>
//                 </Row>
//                 <Row className="componentDesktop">
//                   <Col xs="12">
//                     <Label>{t("Participants")}</Label>
//                     <p>{t("If you list voters' emails, only them will be able to access the election")}</p>
//                     { /* <ReactMultiEmail
//                   placeholder={t("Add here participants' emails")}
//                   emails={emails}
//                   onChange={setEmails}
//                   validateEmail={(email) => {
//                     return isEmail(email); // return boolean
//                   }}
//                   getLabel={(email, index, removeEmail) => {
//                     return (
//                       <div data-tag key={index}>
//                         {email}
//                         <span
//                           data-tag-handle
//                           onClick={() => removeEmail(index)}
//                         >
//                           ×
//                         </span>
//                       </div>
//                     );
//                   }}
//                 />*/}
//                     <div className="mt-2 mailMutedText">
//                       <small className="text-muted">
//                         <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
//                         {t("Copier-coller les emails des participants depuis un fichier Excel")}
//                       </small>
//                     </div>
//                   </Col>
//                 </Row>
//                 <hr className="settings-divider" />
//                 <Col xs="12" md="3">
// 
//                 </Col>
//               </div>
//               <div className="justify-content-center">
//                 {check.ok ? (
//                   <ConfirmModal
//                     title={title}
//                     candidates={candidates}
//                     isTimeLimited={isTimeLimited}
//                     start={start}
//                     finish={finish}
//                     emails={emails}
//                     restrictResult={restrictResult}
//                     restrictVote={restrictVote}
//                     grades={grades.slice(0, numGrades)}
//                     className={"btn float-right btn-block"}
//                     tabIndex={candidates.length + 1}
//                     confirmCallback={handleSubmit}
//                   />
//                 ) : (
//                   <div>
//                     <Button onClick={handleSendNotReady} className="mt-5 componentDesktop btn-transparent cursorPointer btn-validation mb-5 mx-auto" >{t("Confirm")}<img src="/arrow-white.svg" /></Button>
//                     <Button
// 
//                       className="componentMobile btn-confirm-mobile mb-5"
//                       onClick={handleSendNotReady}>
//                       <FontAwesomeIcon className="mr-2" icon={faCheck} />
//                       {t("Valider")}
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>
//         </Container>
//       </ElectionProvider >
//       );
//   };

export default CreateElectionForm;
//
  // const handleIsTimeLimited = (event) => {
  //   setTimeLimited(event.target.value === "1");
  // };

  // const handleRestrictResultCheck = (event) => {
  //   setRestrictResult(event.target.value === "1");
  // };
  // const handleRestrictVote = (event) => {
  //   setRestrictVote(event.target.value === "1");
  // };
//
// import {ReactMultiEmail, isEmail} from "react-multi-email";
// import "react-multi-email/style.css";
// import {toast, ToastContainer} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
//
//
// 
// // Retrieve the day and remove the time. Return a Date
// const dateMinusTime = (date) =>
//   new Date(getOnlyValidDate(date).getTime() - time(getOnlyValidDate(date)));
// 
// const displayClockOptions = () =>
//   Array(24)
//     .fill(1)
//     .map((x, i) => (
//       <option value={i} key={i}>
//         {i}h00
//       </option>
//     ));
//
  //   switch (action.type) {
  //     case 'title': {
  //       election.title = action.value;
  //       return election;
  //     }
  //     case 'time': {
  //       election.endTime = action.value;
  //       return election;
  //     }
  //
  //   }
