class student {
    constructor(onyen, firstName, lastName, group, email){
        this.onyen = onyen
        this.firstName = firstName
        this.lastName = lastName
        this.groups = group
        this.email = email
    }

    addGroup(group){
        this.groups.push(group)
    }

    removeGroup(group){
        if (this.groups.length==0){
            return -1
        }
        if (this.groups.indexOf(group)>-1){
            this.groups.splice(index,1)
            return 0
        }
        return -1
    }
}

class group {
    constructor(id, description) {
        
    }
}

class course {
    
    //Create
    constructor(id, students, instructors ) {
        this.id = id
        this.students = students
        this.instructors = instructors
    }


    //Update
    addStudent(student){
        this.students.push(student)
    }

    addInstructor(instructor) {
        this.instructors.push(instructor)
    }

    removeStudent(student){
        this.students.remove(instructor)
    }
    //Delete

}