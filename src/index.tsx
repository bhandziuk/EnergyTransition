/* @refresh reload */
import 'solid-devtools';
import { render } from 'solid-js/web';
import { A, Route, Router } from "@solidjs/router";
import { Component } from 'solid-js';
import { EnergyCalculator } from './components/EnergyCalculator';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const Home: Component = (props) => {
  return (
    <>

    </>
  );
};

const App = (props: any) => (
  <>
    <nav>
      <A href="/">Home</A>
      {/* <A href="/energy/daily">Daily</A>
      <A href="/energy/monthly">Monthly</A>
      <A href="/energy/calculator">Calculator</A> */}
    </nav>
    {props.children}

  </>
);

render(() =>
  <Router root={App}>
    <Route path="/" component={EnergyCalculator} />
    <Route path="/energy/calculator" component={EnergyCalculator} />
    {/* <Route path="*paramName" component={NotFound} /> */}
  </Router>
  , root!);









