package main

import (
	"log"
	"net/http"
	"os"
	"server/utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"fmt"

	"github.com/gocql/gocql"
)

var Session *gocql.Session

type Emp struct {
	id        string
	firstName string
	lastName  string
	age       int
}

type EmpSample struct {
	Empid     string `json:"Empid"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Age       int    `json:"Age"`
}

type PastWeekWeatherArray struct {
	Emp string
}

func init() {
	var err error

	cluster := gocql.NewCluster("127.0.0.1")
	cluster.Keyspace = "code2succeed"
	Session, err = cluster.CreateSession()
	if err != nil {
		panic(err)
	}
	fmt.Println("cassandra init done")

}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/hello-world", helloWorld)

	// Solves Cross Origin Access Issue
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:4200"},
	})
	handler := c.Handler(r)

	srv := &http.Server{
		Handler: handler,
		Addr:    ":" + os.Getenv("PORT"),
	}

	log.Fatal(srv.ListenAndServe())
}

func helloWorld(w http.ResponseWriter, r *http.Request) {
	var data = struct {
		Title string                 `json:"title"`
		Data  []PastWeekWeatherArray `json:"data"`
	}{
		Title: "RHBUS SOLUTIONS",
		Data:  getEmps(w),
	}

	jsonBytes, err := utils.StructToJson(data)
	if err != nil {
		fmt.Print(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
	return
}

func createEmp(emp Emp) {
	fmt.Println(" **** Creating new emp ****\n", emp)
	if err := Session.Query("INSERT INTO employees(empid, first_name, last_name, age) VALUES(?, ?, ?, ?)",
		emp.id, emp.firstName, emp.lastName, emp.age).Exec(); err != nil {
		fmt.Println("Error while inserting Emp")
		fmt.Println(err)
	}
}

func getEmps(w http.ResponseWriter) []PastWeekWeatherArray {
	fmt.Println("Getting all Employees")
	//var emp []Emp
	var emps []EmpSample
	var data string

	var pastWeekWeatherArray []PastWeekWeatherArray
	m := map[string]interface{}{}

	iter := Session.Query("SELECT * FROM employees").Iter()
	for {
		for iter.MapScan(m) {
			emps = append(emps, EmpSample{
				Empid:     string(m["empid"].(string)),
				FirstName: string(m["first_name"].(string)),
				LastName:  string(m["last_name"].(string)),
				Age:       int(m["age"].(int)),
			})
			jsonBytes1, err := utils.StructToJson(emps)
			if err != nil {
				fmt.Print(err)
			}
			data = string(jsonBytes1)
			m = map[string]interface{}{}
		}
		if !iter.MapScan(m) {
			pastWeekWeatherArray = append(pastWeekWeatherArray, PastWeekWeatherArray{
				Emp: data,
			})
			return pastWeekWeatherArray
		}
	}
}

func updateEmp(emp Emp) {
	fmt.Printf("Updating Emp with id = %s\n", emp.id)
	if err := Session.Query("UPDATE employees SET first_name = ?, last_name = ?, age = ? WHERE empid = ?",
		emp.firstName, emp.lastName, emp.age, emp.id).Exec(); err != nil {
		fmt.Println("Error while updating Emp")
		fmt.Println(err)
	}
}

func deleteEmp(id string) {
	fmt.Printf("Deleting Emp with id = %s\n", id)
	if err := Session.Query("DELETE FROM employees WHERE empid = ?", id).Exec(); err != nil {
		fmt.Println("Error while deleting Emp")
		fmt.Println(err)
	}
}
