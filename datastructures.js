class student {
    constructor(onyen, firstName, lastName, email){
        this.onyen = onyen
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
    }
}

class group {
    constructor(id, description, students = []) {
        this.id = id
        this.description = description
        this.students = students
    }
    addStudent(student){
        this.students.push(student)
    }

    removeStudent(student){
        if (this.students.length==0){
            return -1
        }
        if (this.students.indexOf(student)>-1){
            this.students.splice(this.students.indexOf(student),1)
            return 0
        }
        return -1
    }
}

class course {
    
    //Create
    constructor(id, students=[], groups = [], instructors ) {
        this.id = id
        this.students = students
        this.groups = groups
        this.instructors = instructors
    }


    //Update
    addStudent(student){
        this.students.push(student)
    }

    addInstructor(instructor) {
        this.instructors.push(instructor)
    }
    
    addGroup(group) {
        this.groups.push(group)
    }
    
    //Delete
    removeStudent(student){
        if (this.students.length==0){
            return -1
        }
        if (this.students.indexOf(student)>-1){
            this.groups.splice(this.students.indexOf(student),1)
            return 0
        }
        return -1
    }

    removeGroup(group){
        if (this.groups.length==0){
            return -1
        }
        if (this.groups.indexOf(group)>-1){
            this.groups.splice(this.groups.indexOf(group),1)
            return 0
        }
        return -1
    }

    removeInstructor(instructor){
        if (this.instructors.length==0){
            return -1
        }
        if (this.instructors.indexOf(instructor)>-1){
            this.instructors.splice(this.students.indexOf(instructor),1)
            return 0
        }
        return -1
    }
    

}