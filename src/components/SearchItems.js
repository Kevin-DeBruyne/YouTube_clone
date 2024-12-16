import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from "react-bootstrap/Badge";
import '../Card.css';
function SearchItems(props) {
  return (
    <Card className="card">
      <Badge style={{ position: "absolute", width: "auto" }} bg="danger">
        {props.source}
      </Badge>{" "}
      <Card.Img variant="top" src={props.img} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <a target="_blank" rel="noreferrer" href={props.link}>
          <Button variant="primary">{ props.readmore}</Button>
        </a>
      </Card.Body>
    </Card>
  );
}

export default SearchItems;