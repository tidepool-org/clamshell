/** @jsx React.DOM */
var React = require('react');

var ConversationOverview = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <div className="list-group-item row">
                <div className="col-xs-3">
                    <img ref='authorImage' className="media-object img-circle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAFiElEQVR4Xu3XSUtcaxCH8XLAWRRFxIWKE7gRx6Cigl/deQRxQBQcl6JpJXEeQ73QYlyIdS373q77nFVMquuk/vXzPacLMpnMi3CRwCcTKADMJ5OiLCUAGCCYEgCMKS6KAYMBUwKAMcVFMWAwYEoAMKa4KAYMBkwJAMYUF8WAwYApAcCY4qIYMBgwJQAYU1wUAwYDpgQAY4qLYsBgwJQAYExxUQwYDJgSAIwpLooBgwFTAoAxxUUxYDBgSgAwprgoBgwGTAkAxhQXxYDBgCkBwJjiohgwGDAlABhTXBQDBgOmBABjiotiwGDAlABgTHFRDBgMmBIAjCkuigGDAVMCgDHFRTFgMGBKADCmuCgGDAZMCQDGFBfFgMGAKQHAmOKiGDAYMCUAGFNcFAMGA6YEAGOKi2LAYMCUAGBMcVEMGAyYEgCMKS6KAYMBUwKAMcVFMWAwYEoAMKa4KAYMBkwJAMYUF8WAwYApAcCY4qIYMBgwJQAYU1wUAwYDpgQAY4qLYsBgwJRA3oM5PDyU4+NjGRkZkbKysr+Gz2Qysr29LRUVFdLf3y8FBQXy8vIiW1tbcnZ2ln5ub2+XlpaWT4eW6/t9+j+Wo8K8BXNxcSEK4uDgIEU1NjYm5eXlr7EpjKmpKXl8fJSSkhIZHx+XwsJCWV9fl9PTUyktLZX7+/sEqKenRxobGz+MPNf3y9H+zbfJWzDT09Np4dlLQbw9Yfb29uTo6Cj9s/69gnp6ehL9nMKZmJhI4BRQbW2tdHd3y8bGhhQVFcnAwIBcXl7Kzs5OgtXX1yezs7Ou9xsaGjIv67/wgbwFoyeHPlIWFxfl5uYmnSBZMPrz3NxcetT8+vVLrq+vE5CHh4e0+OLi4vRzFpD+rJ9fW1uT8/Nzqaurk9vb2/S5rq4uaW1tTSeV9/0Ubr5deQsmG7SC0dPgLZiVlZX0d5OTk7K8vCx3d3evJ4qiqK+vT+80ikBPHH1k6QmUBfX8/Jza19TUyI8fP/7aqef9FGC+XeHA6LvG6uqqVFZWSnNzs+zv74sC6OzslIaGhnTy6GPm7SMqe8Lob7y+1Opn9BoeHpbq6uoPwXz1foDJcQLvf+N//vyZHi3vL8Wgp1D2kaR/1lNITyD9FjU6OppgzczMpJNHLwXW29v7IZiv3I8TJsdY9HYLCwtydXX1+kjSpWdfhhWJPp4UgJ4W+o4zPz+f3k2amprk9+/fCU1HR4e0tbXJ5uamnJycSFVVVarRXu+/QXne71+I68u3zPtHkp4Q+mL7/lvS23ccBaOPIP2NVlxLS0sJQ/Y9ZXBwMOFRXFqjL8QKZ3d39/UFWb896eV1v3x84dX58x7MP/mVUSx6guilp8l3X7m+33fO878E852BRu8NmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm8HmOgbdp4PMM6BRm/3B89OPbW5/bE0AAAAAElFTkSuQmCC"/>
                </div>
                <div className="col-xs-9">
                    <h4 ref='messageAuthorAndGroup' className="list-group-item-heading">{this.props.author} User Name > <a href='#' ref='careTeam'>{this.props.name}</a></h4>
                    <span ref='messageWhen' className=''>{this.props.when}</span>
                    <p ref='messageText' className="list-group-item-text">{this.props.latestNoteSummary}</p>
                    <a ref='showMessageThread' href='#' >Comment stuff</a>
                </div>
            </div>
        );
    }
});

module.exports = ConversationOverview;

