import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
    Course, Assignment,
    Event, Placement, Problem,
    Announcement
} from '@/types';
import * as initialData from '@/data/dummyData';

interface DataContextType {
    courses: Course[];
    assignments: Assignment[];
    events: Event[];
    announcements: Announcement[];
    problems: Problem[];
    placements: Placement[];
    addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>) => void;
    addEvent: (event: Omit<Event, 'id' | 'registeredStudents' | 'status'>) => void;
    addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
    addProblem: (problem: Omit<Problem, 'id' | 'createdAt' | 'enrolledStudents' | 'solutions'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = useState<Course[]>(initialData.courses);
    const [assignments, setAssignments] = useState<Assignment[]>(initialData.assignments);
    const [events, setEvents] = useState<Event[]>(initialData.events);
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialData.announcements);
    const [problems, setProblems] = useState<Problem[]>(initialData.problems);
    const [placements, setPlacements] = useState<Placement[]>(initialData.placements);

    const addAssignment = useCallback((newAsst: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>) => {
        const assignment: Assignment = {
            ...newAsst,
            id: `as${Date.now()}`,
            createdAt: new Date().toISOString(),
            submissions: []
        };
        setAssignments(prev => [assignment, ...prev]);
    }, []);

    const addEvent = useCallback((newEv: Omit<Event, 'id' | 'registeredStudents' | 'status'>) => {
        const event: Event = {
            ...newEv,
            id: `ev${Date.now()}`,
            registeredStudents: [],
            status: 'upcoming'
        };
        setEvents(prev => [event, ...prev]);
    }, []);

    const addAnnouncement = useCallback((newAnn: Omit<Announcement, 'id' | 'createdAt'>) => {
        const announcement: Announcement = {
            ...newAnn,
            id: `an${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setAnnouncements(prev => [announcement, ...prev]);
    }, []);

    const addProblem = useCallback((newProb: Omit<Problem, 'id' | 'createdAt' | 'enrolledStudents' | 'solutions'>) => {
        const problem: Problem = {
            ...newProb,
            id: `pr${Date.now()}`,
            createdAt: new Date().toISOString(),
            enrolledStudents: [],
            solutions: []
        };
        setProblems(prev => [problem, ...prev]);
    }, []);

    return (
        <DataContext.Provider value={{
            courses,
            assignments,
            events,
            announcements,
            problems,
            placements,
            addAssignment,
            addEvent,
            addAnnouncement,
            addProblem
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};
