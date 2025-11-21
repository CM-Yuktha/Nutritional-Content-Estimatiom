import React from 'react';
import './Desc.css';

const Desc = () => {
  return (
    <section className="desc">
      <div className="container">
        <div className="desc__grid">
          <article className="desc__card">
            <h3 className="desc__title">Meal Estimator</h3>
            <p className="desc__text">Upload a meal photo and get macro and calorie estimates instantly.</p>
          </article>

          <article className="desc__card">
            <h3 className="desc__title">Smart Logging</h3>
            <p className="desc__text">Search verified foods and save favorites for faster daily logging.</p>
          </article>

          <article className="desc__card">
            <h3 className="desc__title">Insights & Goals</h3>
            <p className="desc__text">Instant, credible nutrition insights that drive signups and retention.</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Desc;
