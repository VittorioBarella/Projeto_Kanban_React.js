import React from "react"; 
import { DragDropContext, DropTarget, DragSource } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

// INÍCIO TAREFAS 
const tasks = [
  { _id: 1, title: "Enterder os objetivos da aplicação e seus principais componentes.", status: "backlog" },
  { _id: 2, title: "Estudar Wiki do Service Place", status: "backlog" },
  { _id: 3, title: "Conseguir configurar seus principais componentes no ambiente local de desenvolvimento", status: "backlog" },
  { _id: 4, title: "Possuir 1 cliente proprio configurado nos ambientes DIT,FIT e Staging.", status: "backlog" },
  { _id: 5, title: "Realizar os treinamentos sugeridos pelo padrinho: React, Storybook", status: "backlog" },
  { _id: 6, title: "Conhecer o código da aplicação", status: "backlog" },
  { _id: 7, title: "Conhecer o frontend lendo o código e inspecionando a UI a partir do browser.", status: "backlog" },
  { _id: 8, title: "Conhecer o backend através do fluxo de execução de alguns serviços", status: "backlog" },
  { _id: 9, title: "Participar ativamente e colaborar nas cerimonias", status: "backlog" },
  { _id: 10, title: "Participar das estimativas expondo seu ponto de vista", status: "backlog" },
  { _id: 11, title: "Cumprir as tarefas dentro do prazo estimado", status: "backlog" },
  { _id: 12, title: "Realizar seções de pair programming com o padrinho ou com os outros membros do time de desenvolvimento", status: "backlog" }
];
// FIM TAREFAS 

const channels = ["backlog", "new", "wip", "review", "done"];
// INÍCIO LABELS DO HEADER 
const labelsMap = {
  backlog: "Backlog",
  new: "Fazer",
  wip: "Em Progresso",
  review: "Em Revisão",
  done: "Feita"
};
// FIM LABELS DO HEADER

// INÍCIO ESTILO DO KANBAN
const classes = {
  board: {
    display: "flex",
    margin: "0 auto",
    width: "90vw",
    fontFamily: 'Arial, "Helvetica Neue", sans-serif',
  },
  column: {
    minWidth: 200,
    width: "18vw",
    height: "80vh",
    margin: "0 auto",
    backgroundColor: "#4d94ff"
  },
  columnHead: {
    textAlign: "center",
    padding: 10,
    fontSize: "1.2em",
    backgroundColor: "#f2f2f2"
  },
  item: {
    padding: 10,
    margin: 10,
    fontSize: "0.8em",
    cursor: "pointer",
    backgroundColor: "white"
  }
};
// FIM ESTILO DO KANBAN
class Kanban extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks
    };
  }
  update = (id, status) => {
    const { tasks } = this.state;
    const task = tasks.find(task => task._id === id);
    task.status = status;
    const taskIndex = tasks.indexOf(task);
    const newTasks = update(tasks, {
      [taskIndex]: { $set: task }
    });
    this.setState({ tasks: newTasks });
  };

  render() {
    const { tasks } = this.state;
    return (
      <main>
        <header> Kanban Board - Tarefas </header>
        <section style={classes.board}>
          {channels.map(channel => (
            <KanbanColumn status={channel}>
              <div style={classes.column}>
                <div style={classes.columnHead}>{labelsMap[channel]}</div>
                <div>
                  {tasks
                    .filter(item => item.status === channel)
                    .map(item => (
                      <KanbanItem id={item._id} onDrop={this.update}>
                        <div style={classes.item}>{item.title}</div>
                      </KanbanItem>
                    ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </section>
      </main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Kanban);

// Coluna

const boxTarget = {
  drop(props) {
    return { name: props.status };
  }
};

class KanbanColumn extends React.Component {
  render() {
    return this.props.connectDropTarget(<div>{this.props.children}</div>);
  }
}

KanbanColumn = DropTarget("kanbanItem", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(KanbanColumn);

// Item

const boxSource = {
  beginDrag(props) {
    return {
      name: props.id
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      props.onDrop(monitor.getItem().name, dropResult.name);
    }
  }
};

class KanbanItem extends React.Component {
  render() {
    return this.props.connectDragSource(<div>{this.props.children}</div>);
  }
}

KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(KanbanItem);
