import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'

const localizer = momentLocalizer(moment)

export default function MyCalendar(props) {

    return (
      <div style={{ height: 550 }}>
        <Calendar
            localizer={localizer}
            events={{
                        id: 2,
                        title: 'DTS STARTS',
                        start: new Date(2021, 10, 2, 0, 0, 0),
                        end: new Date(2021, 10, 5, 0, 0, 0),
                    }}
            startAccessor="start"
            endAccessor="end"
        />
      </div>
    );
}