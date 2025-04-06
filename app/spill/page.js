'use client';

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Starttilstand for spillere
const startSpillere = [
  { navn: "Spiller 1", poeng: [] },
  { navn: "Spiller 2", poeng: [] }
];

export default function DiscGolfApp() {
  const [spillere, setSpillere] = useState(startSpillere);
  const [hull, setHull] = useState(9);
  const [spillIgang, setSpillIgang] = useState(false);
  const [bruker, setBruker] = useState({
    navn: "",
    epost: "",
    statistikk: { beste: null, snitt: null, antallSpill: 0 }
  });
  const [anmeldelse, setAnmeldelse] = useState({ bane: "", rating: 0, tekst: "" });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD1vL1uzCXSb3FDUTcLgydbyDf_cJlNUEE&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.initMap = function () {
      new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 59.9139, lng: 10.7522 }, // Oslo
        zoom: 10,
      });
    };
  }, []);

  const endrePoeng = (spillerIndex, hullIndex, verdi) => {
    const oppdatert = [...spillere];
    oppdatert[spillerIndex].poeng[hullIndex] = parseInt(verdi);
    setSpillere(oppdatert);
  };

  const startNyttSpill = () => {
    const spillOppsett = spillere.map((s) => ({ ...s, poeng: Array(hull).fill(0) }));
    setSpillere(spillOppsett);
    setSpillIgang(true);
  };

  const beregnStatistikk = () => {
    const total = spillere.reduce((sum, s) => sum + s.poeng.reduce((a, b) => a + b, 0), 0);
    const beste = Math.min(...spillere.map((s) => s.poeng.reduce((a, b) => a + b, 0)));
    const snitt = (total / spillere.length).toFixed(2);
    setBruker({
      ...bruker,
      statistikk: {
        beste,
        snitt,
        antallSpill: bruker.statistikk.antallSpill + 1
      }
    });
  };

  const endreAnmeldelse = (e) => {
    const { name, value } = e.target;
    setAnmeldelse({ ...anmeldelse, [name]: value });
  };

  const sendInnAnmeldelse = () => {
    alert(`Takk for anmeldelsen av ${anmeldelse.bane}!`);
    setAnmeldelse({ bane: "", rating: 0, tekst: "" });
  };

  return (
    <>
      <Head>
        <title>Disc Golf Sporing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Disc Golf Sporing</h1>

        <div className="right-panel">
          <h2 className="text-xl font-semibold">Spillkart</h2>
          <div id="map" className="map mb-6" style={{ width: '100%', height: '400px' }}></div>
        </div>

        {!spillIgang && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <h2 className="text-xl font-semibold">Start nytt spill</h2>
              <Input
                type="number"
                min="1"
                max="18"
                placeholder="Antall hull"
                value={hull}
                onChange={(e) => setHull(parseInt(e.target.value))}
              />
              <Button onClick={startNyttSpill}>Start spill</Button>
            </CardContent>
          </Card>
        )}

        {spillIgang && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Poengkort</h2>
              {spillere.map((spiller, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h3 className="font-medium">{spiller.navn}</h3>
                  <div className="grid grid-cols-9 gap-1">
                    {spiller.poeng.map((poeng, hIdx) => (
                      <Input
                        key={hIdx}
                        type="number"
                        min="1"
                        value={poeng}
                        onChange={(e) => endrePoeng(sIdx, hIdx, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Button onClick={beregnStatistikk}>Ferdig</Button>
            </CardContent>
          </Card>
        )}

        {bruker.statistikk.antallSpill > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Dine statistikker</h2>
              <p>Beste poengsum: {bruker.statistikk.beste}</p>
              <p>Snittscore: {bruker.statistikk.snitt}</p>
              <p>Antall spill: {bruker.statistikk.antallSpill}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-2 p-4">
            <h2 className="text-xl font-semibold">Legg inn banereview</h2>
            <Input
              name="bane"
              placeholder="Banenavn"
              value={anmeldelse.bane}
              onChange={endreAnmeldelse}
            />
            <Input
              name="rating"
              type="number"
              placeholder="Poeng (1-5)"
              value={anmeldelse.rating}
              onChange={endreAnmeldelse}
            />
            <Textarea
              name="tekst"
              placeholder="Fritekst anmeldelse"
              value={anmeldelse.tekst}
              onChange={endreAnmeldelse}
            />
            <Button onClick={sendInnAnmeldelse}>Send inn anmeldelse</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
