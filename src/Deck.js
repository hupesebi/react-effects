import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import Card from './Card'

const Deck = () =>{
    const [deckId, setDeckId] = useState();
    const [cards, setCards] = useState([]);
    const [draw, setDraw] = useState(false);

    useEffect(() => {
        async function getDeck (){
            const resp = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/`);
            setDeckId(resp.data.deck_id)
        }
        getDeck()
    }, [])

    const cardsList = cards.map((c) => (
        <Card key={c.id} image={c.image}/>
    ));

    const timerRef = useRef();
    
    useEffect(() => {
        async function drawCard (){
            const resp = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const card = resp.data.cards[0];
            if (resp.data.remaining > 0){
                setCards((cards) => [...cards, {id: card.code, image: card.image}])
            } else{
                setDraw(false)
                alert("No cards left in this deck")
            }
        };

        if(draw){
            timerRef.current = setInterval(async()=> {
                await drawCard()
            }, 1000);
        } else{
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    },[draw, deckId]);

    const toggleDrawCard = () => {
        setDraw(!draw);
    };

    return (
        <React.Fragment>
          {deckId ? (
            <button onClick={toggleDrawCard}>
              {draw ? `Stop Drawing` : `Start Drawing`}
            </button>
          ) : (
            "Loading..."
          )}
          <div>{cardsList}</div>
        </React.Fragment>
      );
}

export default Deck;