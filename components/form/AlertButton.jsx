import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import { faTimes, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AlertDismissibleExample() {
    const [show, setShow] = useState(true);

    if (show) {
        return (
            <Alert className="preventWarning">
                <Alert.Heading>
                    <div>
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    <span>2 candidats minimum</span>
                    </div>
                    <FontAwesomeIcon onClick={() => setShow(false)} icon={faTimes} className="mr-2" />
                </Alert.Heading>

            </Alert>
        );
    }
    return null;
}

