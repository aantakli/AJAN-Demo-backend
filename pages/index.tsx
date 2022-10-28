import Head from 'next/head'
import styles from '../styles/index.module.scss';
import { useState, useEffect } from 'react'
import axios from 'axios';


function Home(){

  let [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [id, setId] = useState("a");
  const [port, setPort] = useState("a");

  const subscribe = (endpoint: string) => {
    const events = new EventSource(`http://localhost:3000/api/node/info/get/${endpoint}?port=${port}`);
    events.onmessage = event => {
      if(event.type == 'message'){
        console.log(event.data)
      }
    };
  };

  function load(){
    setLoading(true);
    axios.get(`http://localhost:3000/api/node/spawn`).then((res) => {
      setId(res.data.id);
      setPort(res.data.port);
      setUrl(`http://localhost:${res.data.port}/rdf4j/repositories/`);
      subscribe(res.data.id);
      setLoading(false);
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AJAN Demo</title>
        <meta name="description" content="AJAN Demo Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.info}>
        {url != "" ? `Url: ${url}` : "No URL requested"}
      </div>
      <img src={"https://raw.githubusercontent.com/aantakli/AJAN-service/master/images/logo_old.bmp"} alt={'ajan-logo'}/>
      {loading? getLoadingButton() : getUrlButton(load, id!="a")}
    </div>
  );
}


function getLoadingButton(){
  return <button className={styles.requestButton}>Loading...</button>
}

function getUrlButton(load: any, known: boolean){
  return <button onClick={load} disabled={known} className={styles.requestButton}>{known? "Requested!" : "Request new Instance"}</button>
}

export default Home;
