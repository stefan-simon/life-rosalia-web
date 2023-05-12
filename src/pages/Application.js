import React from 'react'

import './Application.css'

function Application() {
  return (
    <div className='application'>
      <div className='container'>
        <div className='description'>
          <p>Aplicația LFE ROSALIA vine în întâmpinarea nevoii de educație și conștientizare a importanței speciilor de insecte saproxilice în ecosistemele forestiere din România. Această aplicație mobilă furnizează informații despre speciile rare și vulnerabile de insecte saproxilice și despre conservarea diversității biologice.</p>
          <p>De asemenea, aplicația LIFE ROSALIA permite utilizatorilor să încarce informații despre locația acestor specii în diferitele regiuni ale țării. Aceste date sunt apoi centralizate și analizate de experți pentru a obține o mai bună înțelegere a distribuției speciilor protejate de insecte saproxilice din România.</p>
          <p>Aceste date și informații colectate prin intermediul aplicației LIFE ROSALIA pot fi folosite pentru a dezvolta strategii și programe de conservare a speciilor de insecte saproxilice în România. Mai mult, aceste date pot fi utilizate pentru a informa factorii interesați și autoritățile locale în privința protejării și gestionării adecvate a habitatelor naturale ale acestor specii.</p>
          <p>Prin intermediul aplicației LIFE ROSALIA, utilizatorii pot lua parte activ la conservarea biodiversității și la protejarea speciilor rare și vulnerabile de insecte saproxilice în România. Această platformă oferă o modalitate simplă și accesibilă pentru cetățeni de a contribui la colectarea datelor despre distribuția acestor specii, cu scopul de a sprijini conservarea lor și protejarea ecosistemelor locale.</p>
        </div>
        <div className='app-poster'>
          <img src='/assets/images/LifeROsalia.jpg' alt='Aplicația LFE ROSALIA' />
        </div>
      </div>
    </div>
  )
}

export default Application