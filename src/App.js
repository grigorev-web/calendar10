import DayPicker, { DateUtils } from "react-day-picker";
import React, { useEffect } from "react";
import "react-day-picker/lib/style.css";
import "./styles.css";
import { WEEKDAYS_SHORT, MONTHS } from "./types";
import EventDiv from "./components/EventDiv";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [state, setState] = React.useState(getInitialState());

  function getPosts() {
    var searchParams = new URLSearchParams();
    searchParams.append("from", state.range.from);
    searchParams.append("to", state.range.to);
    //console.log(searchParams);
    fetch(
      "https://russoft.org/wp-content/plugins/react-calendar/api.php?action=get_events&" +
        searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("fetch data: ", data);

        let events = [];
        Object.entries(data).map(([k, obj], key) => {
          events.push(obj);
        });
        console.log(events);
        setState((prevState) => ({
          ...prevState,
          events: events
          //showEvents:
        }));
      });
  }

  useEffect(() => {
    //console.log("did mount", state);
    getPosts();
  }, []);

  function getInitialState() {
    return {
      range: {
        from: new Date(new Date().setHours(0)),
        to: new Date(new Date().setDate(new Date().getDate() + 31))
      },
      enteredTo: new Date(new Date().setDate(new Date().getDate() + 31)),
      events: [],
      showEvents: 10,
      select: { type: "", period: "next-month" }
    };
  }
  function isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    //console.log("isBeforeFirstDay:", isBeforeFirstDay);
    //console.log("from:", from);
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  //////////////////////////////////////////////////////////////////////////////
  function handleDayClick(day) {
    const { from, to } = state.range;
    if (from < to) {
      handleResetClick();
      return;
    }
    if (from && to && day >= from && day <= to) {
      handleResetClick();
      return;
    }
    if (isSelectingFirstDay(from, to, day)) {
      // first click
      //console.log(day);
      //day = new Date(day.setHours(0));
      //console.log(day);
      //return;
      // console.log("first day");
      //console.log(typeof day);
      setState((prevState) => ({
        ...prevState,
        range: {
          from: new Date(day.setHours(0)),
          to: null
        },
        enteredTo: day,
        select: {
          ...prevState.select,
          period: ""
        }
      }));
    } else {
      //console.log("second click"); // second click
      setState((prevState) => ({
        ...prevState,
        range: {
          ...prevState.range,
          to: new Date(day.setHours(23, 59, 59))
        },
        select: {
          ...prevState.select,
          period: ""
        },
        enteredTo: day
      }));
    }
  }
  ///////////////////////////////////////////////////////////////////////////////

  function handleDayMouseEnter(day) {
    const { from, to } = state.range;
    if (!isSelectingFirstDay(from, to, day)) {
      setState((prevState) => ({
        ...prevState,
        enteredTo: day
      }));
    }
  }

  function handleResetClick() {
    setState((prevState) => ({
      ...prevState,
      range: { from: null, to: null },
      select: { type: "", period: "" },
      showEvents: 10
    }));
    //console.log(state);
  }

  function handleSelectType(event) {
    setState((prevState) => ({
      ...prevState,
      showEvents: 10,
      select: {
        ...prevState.select,
        type: event.target.value
      }
    }));
  }

  function handleSelectPeriod(event) {
    switch (event.target.value) {
      ////////////////////////
      case "all-period":
        //console.log("all period");

        setState((prevState) => ({
          ...prevState,
          range: { from: null, to: null },
          showEvents: 10,
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: null
        }));
        break;
      ///////////////////////
      case "next-week":
        // console.log("last-week");
        // let entered = new Date(new Date().setDate(new Date().getDate() + 7));
        //console.log("log:", entered);
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setHours(0)),
            to: new Date(new Date().setDate(new Date().getDate() + 7))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(new Date().setDate(new Date().getDate() + 7)),
          showEvents: 10
        }));
        break;
      //////////////////////
      case "next-month":
        //console.log("last-month");
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setHours(0)),
            to: new Date(new Date().setDate(new Date().getDate() + 31))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(new Date().setDate(new Date().getDate() + 31)),
          showEvents: 10
        }));
        break;
      //////////////////////
      case "next-half-year":
        //console.log("last-half-year");
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setHours(0)),
            to: new Date(new Date().setDate(new Date().getDate() + 180)),
            showEvents: 10
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(new Date().setDate(new Date().getDate() + 180)),
          showEvents: 10
        }));
        break;
      ///////////////////////
      case "next-year":
        //console.log("last-year");
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setHours(0)),
            to: new Date(new Date().setDate(new Date().getDate() + 365)),
            showEvents: 10
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(new Date().setDate(new Date().getDate() + 365))
        }));
        break;
      ///////////////////////
      case "last-week":
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setDate(new Date().getDate() - 7)),
            to: new Date(new Date().setHours(23, 59))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(),
          showEvents: 10
        }));
        break;
      //////////////////////
      case "last-month":
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setDate(new Date().getDate() - 30)),
            to: new Date(new Date().setHours(23, 59))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(),
          showEvents: 10
        }));
        break;
      //////////////////////

      case "last-half-year":
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setDate(new Date().getDate() - 182)),
            to: new Date(new Date().setHours(23, 59))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(),
          showEvents: 10
        }));
        break;
      //////////////////////
      case "last-year":
        setState((prevState) => ({
          ...prevState,
          range: {
            from: new Date(new Date().setDate(new Date().getDate() - 365)),
            to: new Date(new Date().setHours(23, 59))
          },
          select: {
            ...prevState,
            period: event.target.value
          },
          enteredTo: new Date(),
          showEvents: 10
        }));
        break;
      //////////////////////
      default:
      //console.log("error period");
    }
  }

  function fetchMoreData() {
    console.log("fetchMoreData", state.showEvents);
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        showEvents: prevState.showEvents + 10
      }));
      //console.log(state);
    }, 1500);
  }
  const { range, enteredTo } = state;
  //const modifiers = { start: range.from, end: enteredTo };
  const disabledDays = { before: new Date() }; //state.range.from };
  const selectedDays = [range.from, { from: range.from, to: enteredTo }]; //o: enteredTo }];

  let highlighted = state.events.map((v, key) => {
    if (
      state.select.type === "russoft-events" &&
      Array.isArray(v.category) &&
      v.category.length > 0 &&
      v.category[0].slug !== "russoft-events"
    )
      return null;
    if (
      state.select.type === "partners-events" &&
      Array.isArray(v.category) &&
      v.category.length > 0 &&
      v.category[0].slug !== "partners-events"
    )
      return null;
    return new Date(v.date);
  });

  const modifiers = {
    weekends: { daysOfWeek: [6, 0] }, // saturday, sunday
    start: range.from,
    end: range.to,
    highlighted: highlighted
  };

  // Обьекты в диапазоне дат
  let count = 0;
  let events = state.events;
  console.log("events1", state.events);
  // фильтр по Дате
  events = events.filter((obj) => {
    let ev = new Date(obj.date);
    if (
      (ev > state.range.from && ev < state.range.to) ||
      state.range.from == null
    ) {
      count++;
      return true;
    }
    return false;
  });
  console.log("filter date", events);
  console.log("state.select.type", state.select.type);
  // Фильтр наши - не наши мероприятия
  events = events
    .filter((obj) => {
      //console.log("filter", state.select.type);
      let cat = obj.category;
      switch (state.select.type) {
        case "all-events":
          return true;
        case "russoft-events":
          if (
            Array.isArray(cat) &&
            cat.length > 0 &&
            cat[0].slug !== "russoft-events"
          ) {
            //console.log("Это не РУССОФТ!", cat[0].slug);
            count--;
            return false;
          } else if (!Array.isArray(cat)) {
            count--;
            return false;
          }

          return 1;
        case "partners-events":
          if (
            Array.isArray(cat) &&
            cat.length > 0 &&
            cat[0].slug !== "partners-events"
          ) {
            count--;
            return false;
          } else if (!Array.isArray(cat)) {
            count--;
            return false;
          }
          return 1;

        case "company-events":
          if (
            Array.isArray(cat) &&
            cat.length > 0 &&
            cat[0].slug !== "company-events"
          ) {
            count--;
            return false;
          } else if (!Array.isArray(cat)) {
            count--;
            return false;
          }
          return 1;
        default:
          return 1;
      }
    })
    .sort(function (a, b) {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateA - dateB; //сортировка по возрастающей дате
    })
    .reverse();
  console.log("events", events);
  console.log("events length", events.length);
  let listEvents = events
    .map((v, key) => <EventDiv key={key} event={v} />)
    .slice(0, state.showEvents);

  console.log("listEvents", listEvents);
  let hasMore = state.showEvents < count ? true : false;
  //console.log(state);
  return (
    <div>
      <DayPicker
        className="Range"
        numberOfMonths={2}
        firstDayOfWeek={1}
        fromMonth={range.from}
        selectedDays={selectedDays}
        disabledDays={disabledDays}
        modifiers={modifiers}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        months={MONTHS}
        weekdaysShort={WEEKDAYS_SHORT}
      />
      <div className="DayPicker-filter">
        <div className="DayPicker-filter__select">
          <select value={state.select.type} onChange={handleSelectType}>
            <option value="all-events">Все мероприятия</option>
            <option value="russoft-events">Мероприятия РУССОФТ</option>
            <option value="partners-events">Мероприятия партнеров</option>
            <option value="company-events">Мероприятия компаний</option>
          </select>

          <select value={state.select.period} onChange={handleSelectPeriod}>
            <option value="all-period">За все время</option>
            <option value="next-week">На неделю вперед</option>
            <option value="next-month">На месяц вперед</option>
            <option value="next-half-year">На полгода вперед</option>
            <option value="next-year">На год вперед</option>

            <option value="last-week">За прошлую неделю</option>
            <option value="last-month">За прошлый месяц</option>
            <option value="last-half-year">За прошлые полгода</option>
            <option value="last-year">За прошлый год</option>
          </select>
        </div>
        {/* !range.from && !range.to && "Please select the first day." */}
        {/* range.from && !range.to && "Please select the last day." */}
        {/* range.from &&
          range.to &&
          `Selected from ${range.from.toLocaleDateString()} to
        ${range.to.toLocaleDateString()}` */}
        <div className="DayPicker-filter__clear-button">
          <button className="link" onClick={handleResetClick}>
            Очистить фильтр
          </button>
        </div>
      </div>

      <div className="counter">{events.length} мероприятий</div>
      <div className="row row_flex">
        <InfiniteScroll
          dataLength={state.showEvents}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Загрузка...</h4>}
        >
          {listEvents}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
