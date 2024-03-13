"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  /*
        NAVERCLOUD
        Client ID       8fszt89398  (X-NCP-APIGW-API-KEY-ID)
        Client Secret   4DURagX2Zv64RfMroW10bOX0SBAE2gCD865pmxfr    (X-NCP-APIGW-API-KEY)

    */

  const [, setRender] = useState(false);
  const mapRef = useRef<any>(null);
  const paikRef = useRef<any[]>([]);
  const megaRef = useRef<any[]>([]);

  useEffect(() => {
    // @ts-ignore
    var map = new naver.maps.Map("map", {
      // @ts-ignore
      center: new naver.maps.LatLng(36.3126128, 127.435389),
      zoom: 10,
      minZoom: 12,
    });

    mapRef.current = map;
  }, []);

  const getPaik = () => {
    return new Promise(async (resolve) => {
      const settled1 = await Promise.allSettled(
        new Array(10)
          .fill(null)
          .map((_, index) =>
            axios.get(
              `https://theborndb.theborn.co.kr/wp-json/api/get_store/?state=9&category=275&depth1=20&depth2=&paged=${
                index + 1
              }&search_string=`
            )
          )
      );

      const reduced1 = settled1.reduce((prev: any, curr: any) => {
        return [...prev, ...curr.value.data.results];
      }, []);

      const settled2 = await Promise.allSettled(
        reduced1.map((data: any) => {
          return new Promise((resolve) => {
            const { store_address } = data;
            // @ts-ignore
            naver.maps.Service.geocode(
              { query: store_address },
              function (status, response) {
                if (response.v2.addresses[0] === undefined) {
                  console.log(data);
                }
                resolve({ ...response.v2.addresses[0], store: data });
              }
            );
          });
        })
      );

      const mapped1 = settled2.map((_: any) => {
        return _.value;
      });

      for (let i = 0; i < mapped1.length; i++) {
        // @ts-ignore
        var marker = new naver.maps.Marker({
          // @ts-ignore
          position: new naver.maps.LatLng(mapped1[i].y, mapped1[i].x),
          map: mapRef.current,
          //   icon: {
          // url: "/paik.png",
          // // @ts-ignore
          // size: new naver.maps.Size(50, 52),
          // // @ts-ignore
          // origin: new naver.maps.Point(0, 0),
          // // @ts-ignore
          // anchor: new naver.maps.Point(25, 26),
          //   },
        });
      }

      paikRef.current = mapped1;
      console.log(mapped1);
      resolve(mapped1);
    });
  };

  const getMega2 = async () => {
    try {
      const res = await axios.get(
        "/mega/store_search.php?store_search=%EB%8C%80%EC%A0%84"
      );

      const megaHidden = document.getElementById("megaHidden");
      if (megaHidden) megaHidden.innerHTML = res.data;

      console.log(megaHidden);
      Array.from(document.getElementsByClassName("cont_text")).forEach((_) => {
        const store_name = String(_.getElementsByTagName("b")[0].innerHTML);
        const store_info = String(
          _.getElementsByClassName("cont_text_info")[0].innerHTML
        )
          .replaceAll("\t", "")
          .replaceAll("\n", "");
      });
    } catch (error) {}
  };

  const getMega = async () => {
    try {
      let res = [];

      const q = await axios.get(
        `/mega/store.php?lat=36.3736603969621&lng=127.31835405407382`
      );
      const w = await axios.get(
        `/mega/store.php?lat=36.33691086037413&lng=127.44758849202687`
      );
      const e = await axios.get(
        `/mega/store.php?lat=36.34926706986817&lng=127.37671852543968`
      );
      const r = await axios.get(
        `/mega/store.php?lat=36.36724994820482&lng=127.43136009574901`
      );
      const t = await axios.get(
        `/mega/store.php?lat=36.32776877727852&lng=127.42401462100376`
      );

      res.push(...q.data.positions);
      res.push(...w.data.positions);
      res.push(...e.data.positions);
      res.push(...r.data.positions);
      res.push(...t.data.positions);

      res = res.reduce((prev, curr) => {
        return prev.find((_: any) => _.idx === curr.idx)
          ? prev
          : [...prev, curr];
      }, []);

      megaRef.current = res;

      console.log(res);
    } catch (error) {}
  };

  const handleClick5 = () => {
    const reduced = megaRef.current.reduce((prev, curr) => {
      return prev.find((_: any) => _.idx === curr.idx) ? prev : [...prev, curr];
    }, []);

    console.log(reduced);
    // for (let i = 0; i < megaGeoRef.current.length; i++) {
    //     // @ts-ignore
    //     var marker = new naver.maps.Marker({
    //         // @ts-ignore
    //         position: new naver.maps.LatLng(megaGeoRef.current[i].y, megaGeoRef.current[i].x),
    //         map: mapRef.current,
    //     });
    //     console.log(marker);
    // }
  };

  const render = () => {
    setRender((prev) => !prev);
  };

  return (
    <main className="flex w-screen h-screen">
      <div id="map" className="w-[1000px]"></div>
      <div className="[&_button]:border [&_button]:p-2">
        <button onClick={getPaik}>Get Paik</button>
        <button onClick={getMega2}>mega2</button>
        <button onClick={getMega}>mega</button>
        <button onClick={handleClick5}>mega get</button>
        <button onClick={render}>render</button>
      </div>
      <div hidden id="megaHidden"></div>
    </main>
  );
}

// const getGeo = async (data: any) => {
//     const { store_address, store_brand, store_name } = data;

//     // @ts-ignore
//     naver.maps.Service.geocode({ query: store_address }, function (status, response) {
//         // @ts-ignore

//         if (response.v2.addresses[0] === undefined) {
//             // 중앙로 지하상가
//             console.log(data);
//         }

//         paikGeoRef.current.push({ ...response.v2.addresses[0], store: data });
//     });

//     // try {
//     //     const { data } = await axios.get(`/naver/v1/search/local.json?query=${encodeURI(store_brand + " " + store_name)}`, {
//     //         headers: {
//     //             "X-Naver-Client-Id": "fZvD1kVqj6utqG9zKiD4",
//     //             "X-Naver-Client-Secret": "f33lvNarMU",
//     //         },
//     //     });
//     //     paikGeoRef.current.push(data.items[0]);
//     // } catch (error) {}
// };

// const handleClick2 = () => {
//     if (paikRef.current.length === 0) return;
//     // let i = 0;
//     // const si = setInterval(() => {
//     //     getGeo(paikRef.current[i]);
//     //     i++;
//     //     if (i === paikRef.current.length) {
//     //         clearInterval(si);
//     //     }
//     // }, 100);

//     for (let i = 0; i < paikRef.current.length; i++) {
//         getGeo(paikRef.current[i]);
//     }
// };
